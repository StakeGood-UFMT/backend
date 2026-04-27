import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let userRepo: any;
  let marketRepo: any;
  let snapshotRepo: any;
  let userPositionRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(MarketEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(MarketSnapshotEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(DepositEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserPositionEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    marketRepo = module.get(getRepositoryToken(MarketEntity));
    snapshotRepo = module.get(getRepositoryToken(MarketSnapshotEntity));
    userPositionRepo = module.get(getRepositoryToken(UserPositionEntity));
  });

  describe('checkSpendingLimit', () => {
    it('test_limit_not_exceeded', async () => {
      const user = {
        id: 'user1',
        spendingLimitUsd: 500,
        spendingWindowDays: 30,
      } as UserEntity;

      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '100' }),
      };
      userPositionRepo.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(
        service['checkSpendingLimit'](user, 50),
      ).resolves.not.toThrow();
    });

    it('test_limit_exceeded_returns_403', async () => {
      const user = {
        id: 'user1',
        spendingLimitUsd: 500,
        spendingWindowDays: 30,
      } as UserEntity;

      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '460' }),
      };
      userPositionRepo.createQueryBuilder.mockReturnValue(queryBuilder);

      try {
        await service['checkSpendingLimit'](user, 50);
        throw new Error('Should have thrown ForbiddenException');
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        const response = (e as ForbiddenException).getResponse() as any;
        expect(response.error).toBe('SPENDING_LIMIT_EXCEEDED');
        expect(response.remaining).toBe('40.00');
      }
    });
  });

  describe('buildPrediction', () => {
    const mockUser = {
      id: 'u1',
      primaryWallet: 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4',
      kycStatus: 'verified',
      spendingLimitUsd: 1000,
      spendingWindowDays: 30,
    };

    const mockMarket = {
      id: 'm1',
      title: 'Market 1',
      status: 'active',
      lockAt: new Date(Date.now() + 100000),
      contractAddress:
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
    };

    beforeEach(() => {
      userRepo.findOne.mockResolvedValue(mockUser);
      marketRepo.findOne.mockResolvedValue(mockMarket);
      snapshotRepo.findOne.mockResolvedValue({
        yesPool: '1000',
        noPool: '1000',
      });

      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '0' }),
      };
      userPositionRepo.createQueryBuilder.mockReturnValue(queryBuilder);
      userPositionRepo.findOne.mockResolvedValue(null);
    });

    it('test_build_prediction_ok', async () => {
      const dto = { market_id: 'm1', outcome: 'YES' as const, amount: '100' };
      const result = await service.buildPrediction(dto, { userId: 'u1' });

      expect(result).toBeDefined();
      expect(result.xdr).toBeDefined();
      expect(result.summary.outcome).toBe('YES');
      expect(result.summary.amount).toBe('100 USDC');
    });

    it('test_hedge_lock_violation_fails', async () => {
      // User already has a NO position
      userPositionRepo.findOne.mockResolvedValue({ outcome: 'NO' });

      const dto = { market_id: 'm1', outcome: 'YES' as const, amount: '100' };

      await expect(
        service.buildPrediction(dto, { userId: 'u1' }),
      ).rejects.toThrow(ConflictException);
    });

    it('test_kyc_required_fails', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser, kycStatus: 'pending' });

      const dto = { market_id: 'm1', outcome: 'YES' as const, amount: '100' };

      await expect(
        service.buildPrediction(dto, { userId: 'u1' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
