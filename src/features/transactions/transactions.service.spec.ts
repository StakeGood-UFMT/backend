import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
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
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    userPositionRepo = module.get(getRepositoryToken(UserPositionEntity));
  });

  describe('checkSpendingLimit', () => {
    it('test_limit_not_exceeded', async () => {
      const user = { id: 'user1', spendingLimitUsd: 500, spendingWindowDays: 30 } as UserEntity;
      
      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '100' }),
      };
      userPositionRepo.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(service['checkSpendingLimit'](user, 50)).resolves.not.toThrow();
    });

    it('test_limit_exceeded_returns_403', async () => {
      const user = { id: 'user1', spendingLimitUsd: 500, spendingWindowDays: 30 } as UserEntity;
      
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

    it('test_limit_reset_after_window', async () => {
      const user = { id: 'user1', spendingLimitUsd: 500, spendingWindowDays: 30 } as UserEntity;
      
      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '0' }),
      };
      userPositionRepo.createQueryBuilder.mockReturnValue(queryBuilder);

      await service['checkSpendingLimit'](user, 500);
      
      // Verify windowStart calculation
      const windowStartArg = queryBuilder.andWhere.mock.calls.find(
        (call: any) => call[0] === 'up.created_at >= :windowStart'
      )[1].windowStart;
      
      expect(windowStartArg).toBeInstanceOf(Date);
      const expectedDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      // Check within 1 second tolerance
      expect(Math.abs(windowStartArg.getTime() - expectedDate.getTime())).toBeLessThan(1000);
    });
  });
});
