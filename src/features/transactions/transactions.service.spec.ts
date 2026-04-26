import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { ClaimEntity } from '../../database/entities/claim.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { VoteEntity } from '../../database/entities/vote.entity';
import { TxIntentEntity } from '../../database/entities/tx-intent.entity';

describe('TransactionsService', () => {
  let module: TestingModule;
  let service: TransactionsService;
  let userRepo: any;
  let marketRepo: any;
  let snapshotRepo: any;
  let userPositionRepo: any;
  let claimRepo: any;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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
        {
          provide: getRepositoryToken(ClaimEntity),
          useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(NgoEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(VoteEntity),
          useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(TxIntentEntity),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    marketRepo = module.get(getRepositoryToken(MarketEntity));
    snapshotRepo = module.get(getRepositoryToken(MarketSnapshotEntity));
    userPositionRepo = module.get(getRepositoryToken(UserPositionEntity));
    claimRepo = module.get(getRepositoryToken(ClaimEntity));
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
  });

  describe('buildClaim', () => {
    const jwtUser = { userId: 'u1' };

    const mockUser = {
      id: 'u1',
      primaryWallet: 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4',
      kycStatus: 'verified',
    };

    const mockMarket = {
      id: 'm1',
      title: 'Market 1',
      status: 'resolved',
      contractAddress: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      outcome: 'YES',
    };

    const mockPosition = {
      id: 'p1',
      userId: 'u1',
      marketId: 'm1',
      outcome: 'YES',
      amountStaked: '100',
      status: 'confirmed',
    };

    beforeEach(() => {
      userRepo.findOne.mockResolvedValue(mockUser);
      marketRepo.findOne.mockResolvedValue(mockMarket);
      userPositionRepo.findOne.mockResolvedValue(mockPosition);
      claimRepo.findOne.mockResolvedValue(null);
      claimRepo.create.mockReturnValue({ ...mockPosition, id: 'c1', xdr: 'xdr', status: 'pending' });
      claimRepo.save.mockResolvedValue(undefined);
    });

    it('test_build_claim_ok', async () => {
      const dto = { market_id: 'm1' };
      const result = await service.buildClaim(dto, jwtUser);

      expect(result).toBeDefined();
      expect(result.xdr).toBeDefined();
      expect(result.claimId).toBe('c1');
      expect(result.summary.action).toBe('claim_reward');
      expect(claimRepo.save).toHaveBeenCalled();
    });

    it('test_build_claim_ok_canceled_market', async () => {
      marketRepo.findOne.mockResolvedValue({ ...mockMarket, status: 'canceled' });

      const result = await service.buildClaim({ market_id: 'm1' }, jwtUser);
      expect(result.summary.market.status).toBe('canceled');
    });

    it('test_double_claim_pre_check_position_already_claimed', async () => {
      userPositionRepo.findOne.mockResolvedValue({ ...mockPosition, status: 'claimed' });

      await expect(service.buildClaim({ market_id: 'm1' }, jwtUser))
        .rejects.toThrow(ConflictException);
    });

    it('test_double_claim_pre_check_pending_claim_exists', async () => {
      claimRepo.findOne.mockResolvedValue({ id: 'c1', status: 'pending' });

      await expect(service.buildClaim({ market_id: 'm1' }, jwtUser))
        .rejects.toThrow(ConflictException);
    });

    it('test_market_not_claimable', async () => {
      marketRepo.findOne.mockResolvedValue({ ...mockMarket, status: 'active' });

      await expect(service.buildClaim({ market_id: 'm1' }, jwtUser))
        .rejects.toThrow(BadRequestException);
    });

    it('test_no_position', async () => {
      userPositionRepo.findOne.mockResolvedValue(null);

      await expect(service.buildClaim({ market_id: 'm1' }, jwtUser))
        .rejects.toThrow(NotFoundException);
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
      contractAddress: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
    };

    beforeEach(() => {
      userRepo.findOne.mockResolvedValue(mockUser);
      marketRepo.findOne.mockResolvedValue(mockMarket);
      snapshotRepo.findOne.mockResolvedValue({ yesPool: '1000', noPool: '1000' });
      
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
      
      await expect(service.buildPrediction(dto, { userId: 'u1' }))
        .rejects.toThrow(ConflictException);
    });

    it('test_kyc_required_fails', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser, kycStatus: 'pending' });

      const dto = { market_id: 'm1', outcome: 'YES' as const, amount: '100' };

      await expect(service.buildPrediction(dto, { userId: 'u1' }))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('buildVote', () => {
    const jwtUser = { userId: 'u1' };

    const mockUser = {
      id: 'u1',
      primaryWallet: 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4',
      kycStatus: 'verified',
    };

    // 100 USDC → 1_000_000_000 stroops → credits = floor(sqrt(1_000_000_000)) = 31622
    const mockPosition = {
      id: 'p1',
      userId: 'u1',
      marketId: 'm1',
      outcome: 'YES',
      amountStaked: '100',
      status: 'confirmed',
    };

    const mockMarket = {
      id: 'm1',
      title: 'Market 1',
      status: 'resolved',
      outcome: 'YES',
      contractAddress: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
    };

    const mockNgo = {
      id: 'ngo1',
      name: 'Save the Forest',
      walletAddress: 'GCWD3PDC7WSRPRXZQ4A6L724VV2UXSRAOWE2HYLJSSDGUG4AGXTUX5D4',
    };

    let ngoRepo: any;
    let voteRepo: any;
    let txIntentRepo: any;

    beforeEach(() => {
      ngoRepo = module.get(getRepositoryToken(NgoEntity));
      voteRepo = module.get(getRepositoryToken(VoteEntity));
      txIntentRepo = module.get(getRepositoryToken(TxIntentEntity));

      userRepo.findOne.mockResolvedValue(mockUser);
      marketRepo.findOne.mockResolvedValue(mockMarket);
      userPositionRepo.findOne.mockResolvedValue(mockPosition);
      ngoRepo.findOne.mockResolvedValue(mockNgo);
      voteRepo.findOne.mockResolvedValue(null);
      voteRepo.create.mockReturnValue({ id: 'v1', status: 'pending' });
      voteRepo.save.mockResolvedValue(undefined);
      txIntentRepo.create.mockReturnValue({ id: 'ti1', status: 'pending' });
      txIntentRepo.save.mockResolvedValue(undefined);
    });

    it('test_build_vote_ok', async () => {
      const dto = { market_id: 'm1', ngo_id: 'ngo1', allocated_votes: 3 };
      const result = await service.buildVote(dto, jwtUser);

      expect(result).toBeDefined();
      expect(result.xdr).toBeDefined();
      expect(result.summary.action).toBe('cast_philanthropic_vote');
      expect(result.summary.allocated_votes).toBe(3);
      expect(result.summary.credits_used).toBe(9); // 3² = 9
      expect(result.summary.credits_available).toBeGreaterThanOrEqual(9);
      expect(voteRepo.save).toHaveBeenCalled();
      expect(txIntentRepo.save).toHaveBeenCalled();
    });

    it('test_insufficient_credits_fails', async () => {
      // credits = 31622; allocated_votes=200 → cost=40000 > 31622
      const dto = { market_id: 'm1', ngo_id: 'ngo1', allocated_votes: 200 };

      let caught: any;
      try {
        await service.buildVote(dto, jwtUser);
      } catch (e) {
        caught = e;
      }

      expect(caught).toBeInstanceOf(ForbiddenException);
      const response = caught.getResponse() as any;
      expect(response.error).toBe('INSUFFICIENT_CREDITS');
      expect(response.cost).toBe(40000);
      expect(response.credits).toBeLessThan(40000);
    });

    it('test_already_voted_fails', async () => {
      voteRepo.findOne.mockResolvedValue({ id: 'v1' });

      await expect(service.buildVote({ market_id: 'm1', ngo_id: 'ngo1', allocated_votes: 1 }, jwtUser))
        .rejects.toThrow(ConflictException);
    });

    it('test_not_winner_fails', async () => {
      userPositionRepo.findOne.mockResolvedValue({ ...mockPosition, outcome: 'NO' });

      await expect(service.buildVote({ market_id: 'm1', ngo_id: 'ngo1', allocated_votes: 1 }, jwtUser))
        .rejects.toThrow(ForbiddenException);
    });

    it('test_market_not_resolved_fails', async () => {
      marketRepo.findOne.mockResolvedValue({ ...mockMarket, status: 'active' });

      await expect(service.buildVote({ market_id: 'm1', ngo_id: 'ngo1', allocated_votes: 1 }, jwtUser))
        .rejects.toThrow(BadRequestException);
    });
  });
});

