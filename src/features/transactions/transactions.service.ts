import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as StellarSdk from '@stellar/stellar-sdk';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { ClaimEntity } from '../../database/entities/claim.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { VoteEntity } from '../../database/entities/vote.entity';
import { TxIntentEntity } from '../../database/entities/tx-intent.entity';
import { BuildPredictionDto } from './dto/build-prediction.dto';
import { BuildClaimDto } from './dto/build-claim.dto';
import { BuildVoteDto } from './dto/build-vote.dto';
import { SubmitTransactionDto } from './dto/submit-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @InjectRepository(MarketSnapshotEntity)
    private readonly snapshotRepo: Repository<MarketSnapshotEntity>,
    @InjectRepository(DepositEntity)
    private readonly depositRepo: Repository<DepositEntity>,
    @InjectRepository(UserPositionEntity)
    private readonly userPositionRepo: Repository<UserPositionEntity>,
    @InjectRepository(ClaimEntity)
    private readonly claimRepo: Repository<ClaimEntity>,
    @InjectRepository(NgoEntity)
    private readonly ngoRepo: Repository<NgoEntity>,
    @InjectRepository(VoteEntity)
    private readonly voteRepo: Repository<VoteEntity>,
    @InjectRepository(TxIntentEntity)
    private readonly txIntentRepo: Repository<TxIntentEntity>,
  ) {}

  async buildPrediction(dto: BuildPredictionDto, jwtUser: any) {
    const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
    if (!user) throw new NotFoundException('User not found');

    // Validation: KYC Status
    if (user.kycStatus !== 'verified') {
      throw new ForbiddenException({
        error: 'KYC_REQUIRED',
        kyc_status: user.kycStatus,
        message: 'Verified KYC is required to place predictions.'
      });
    }

    // Validation: Spending Limit (BE-6A)
    await this.checkSpendingLimit(user, parseFloat(dto.amount));

    const market = await this.marketRepo.findOne({ where: { id: dto.market_id } });
    if (!market) throw new NotFoundException('Market not found');

    // Validation: Market Status and Lock Time
    if (market.status !== 'active') {
      throw new BadRequestException('Market is not active');
    }
    if (new Date() >= market.lockAt) {
      throw new BadRequestException('Market is locked for betting');
    }

    // Validation: Hedge Lock (Anti-Hedge)
    // Users cannot bet on the opposite outcome if they already have a position
    const existingPosition = await this.userPositionRepo.findOne({
      where: { userId: user.id, marketId: market.id },
    });

    if (existingPosition && existingPosition.outcome !== dto.outcome) {
      throw new ConflictException({
        error: 'HEDGE_LOCK_VIOLATION',
        message: 'Hedging is not allowed. You already have a position on the opposite outcome in this market.',
        existing_outcome: existingPosition.outcome,
      });
    }

    const snapshot = await this.snapshotRepo.findOne({
      where: { marketId: market.id },
      order: { timestamp: 'DESC' },
    });

    const yesPool = snapshot ? parseFloat(snapshot.yesPool as any) : 50000;
    const noPool = snapshot ? parseFloat(snapshot.noPool as any) : 50000;
    const amount = parseFloat(dto.amount);

    const impliedProbability = yesPool / (yesPool + noPool);
    const payoutMultiplier = dto.outcome === 'YES'
      ? (yesPool + noPool + amount) / (yesPool + amount)
      : (yesPool + noPool + amount) / (noPool + amount);
    const potentialWin = amount * payoutMultiplier;

    // Soroban XDR Generation
    // Function: place_prediction(user: Address, market_id: u64, outcome: u32, amount: i128)
    const contractId = market.contractAddress || 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4'; // Placeholder if not set
    const amountStroops = BigInt(Math.floor(amount * 10000000)); // 7 decimals for USDC/SAC
    
    // TODO: Maintain a numeric mapping for market_id (u64) in the database
    // For now using 1 as a placeholder for the contract-side market ID
    const marketIdU64 = BigInt(1); 
    const outcomeU32 = dto.outcome === 'YES' ? 1 : 2;

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'place_prediction',
          args: [
            StellarSdk.nativeToScVal(new StellarSdk.Address(user.primaryWallet)),
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
            StellarSdk.nativeToScVal(outcomeU32, { type: 'u32' }),
            StellarSdk.nativeToScVal(amountStroops, { type: 'i128' }),
          ],
        }),
      ),
      auth: [],
    });

    // Build the transaction (without signing, to be returned as XDR)
    // Note: We use a dummy sequence '0' as the frontend will typically handle the sequence or fetch it
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(user.primaryWallet, '0'),
      { fee: '10000', networkPassphrase: StellarSdk.Networks.TESTNET }
    )
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    const xdr = tx.toXDR();

    return {
      xdr,
      txHash: tx.hash().toString('hex'),
      summary: {
        action: 'place_prediction',
        market: { id: market.id, title: market.title },
        outcome: dto.outcome,
        amount: `${dto.amount} USDC`,
        implied_probability: impliedProbability.toFixed(3),
        implied_odds: payoutMultiplier.toFixed(2),
        potential_win: `${potentialWin.toFixed(2)} USDC`,
      },
    };
  }

  async buildClaim(dto: BuildClaimDto, jwtUser: any) {
    const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
    if (!user) throw new NotFoundException('User not found');

    const market = await this.marketRepo.findOne({ where: { id: dto.market_id } });
    if (!market) throw new NotFoundException('Market not found');

    if (market.status !== 'resolved' && market.status !== 'canceled') {
      throw new BadRequestException({
        error: 'MARKET_NOT_CLAIMABLE',
        message: 'Market must be resolved or canceled to claim rewards.',
        current_status: market.status,
      });
    }

    const position = await this.userPositionRepo.findOne({
      where: { userId: user.id, marketId: market.id },
    });

    if (!position) throw new NotFoundException('No position found for this user in this market');

    if (position.status === 'claimed') {
      throw new ConflictException({
        error: 'ALREADY_CLAIMED',
        message: 'Reward for this market has already been claimed.',
      });
    }

    const existingClaim = await this.claimRepo.findOne({
      where: { userId: user.id, marketId: market.id, status: 'pending' },
    });

    if (existingClaim) {
      throw new ConflictException({
        error: 'CLAIM_IN_PROGRESS',
        message: 'A claim for this market is already pending.',
        claim_id: existingClaim.id,
      });
    }

    const contractId = market.contractAddress || 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4';
    const marketIdU64 = BigInt(1);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'claim_reward',
          args: [
            StellarSdk.nativeToScVal(new StellarSdk.Address(user.primaryWallet)),
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
          ],
        }),
      ),
      auth: [],
    });

    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(user.primaryWallet, '0'),
      { fee: '10000', networkPassphrase: StellarSdk.Networks.TESTNET },
    )
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    const xdr = tx.toXDR();

    const claim = this.claimRepo.create({
      userId: user.id,
      marketId: market.id,
      positionId: position.id,
      xdr,
      status: 'pending',
    });
    await this.claimRepo.save(claim);

    return {
      xdr,
      claimId: claim.id,
      summary: {
        action: 'claim_reward',
        market: { id: market.id, title: market.title, status: market.status },
        outcome: position.outcome,
        amount_staked: `${position.amountStaked} USDC`,
      },
    };
  }

  async buildVote(dto: BuildVoteDto, jwtUser: any) {
    const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.kycStatus !== 'verified') {
      throw new ForbiddenException({
        error: 'KYC_REQUIRED',
        kyc_status: user.kycStatus,
        message: 'Verified KYC is required to vote.',
      });
    }

    const market = await this.marketRepo.findOne({ where: { id: dto.market_id } });
    if (!market) throw new NotFoundException('Market not found');

    if (market.status !== 'resolved') {
      throw new BadRequestException({
        error: 'MARKET_NOT_RESOLVED',
        message: 'Voting is only allowed on resolved markets.',
        current_status: market.status,
      });
    }

    const position = await this.userPositionRepo.findOne({
      where: { userId: user.id, marketId: market.id, status: 'confirmed' },
    });

    if (!position) {
      throw new ForbiddenException({
        error: 'VOTE_NOT_ELIGIBLE',
        message: 'You do not have a confirmed position in this market.',
      });
    }

    if (position.outcome !== market.outcome) {
      throw new ForbiddenException({
        error: 'VOTE_NOT_ELIGIBLE',
        message: 'Only winners of the market outcome can vote.',
        your_outcome: position.outcome,
        winning_outcome: market.outcome,
      });
    }

    const existingVote = await this.voteRepo.findOne({
      where: { userId: user.id, marketId: market.id },
    });

    if (existingVote) {
      throw new ConflictException({
        error: 'ALREADY_VOTED',
        message: 'You have already voted in this market.',
        vote_id: existingVote.id,
      });
    }

    const ngo = await this.ngoRepo.findOne({ where: { id: dto.ngo_id } });
    if (!ngo) throw new NotFoundException('NGO not found');

    const amountStroops = BigInt(Math.floor(Number(position.amountStaked) * 10_000_000));
    const credits = Math.floor(Math.sqrt(Number(amountStroops)));
    const cost = dto.allocated_votes * dto.allocated_votes;

    if (cost > credits) {
      throw new ForbiddenException({
        error: 'INSUFFICIENT_CREDITS',
        message: `Insufficient quadratic credits. Cost is ${cost} but you only have ${credits} credits.`,
        credits,
        cost,
        allocated_votes: dto.allocated_votes,
      });
    }

    const contractId = market.contractAddress || 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4';
    const marketIdU64 = BigInt(1);
    const allocatedVotesU32 = dto.allocated_votes;

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'cast_philanthropic_vote',
          args: [
            StellarSdk.nativeToScVal(new StellarSdk.Address(user.primaryWallet)),
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
            StellarSdk.nativeToScVal(ngo.walletAddress),
            StellarSdk.nativeToScVal(allocatedVotesU32, { type: 'u32' }),
          ],
        }),
      ),
      auth: [],
    });

    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(user.primaryWallet, '0'),
      { fee: '10000', networkPassphrase: StellarSdk.Networks.TESTNET },
    )
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    const xdr = tx.toXDR();

    const intent = this.txIntentRepo.create({
      adminId: user.id,
      action: 'cast_philanthropic_vote',
      xdr,
      status: 'pending',
    });
    await this.txIntentRepo.save(intent);

    const vote = this.voteRepo.create({
      userId: user.id,
      marketId: market.id,
      ngoId: ngo.id,
      allocatedVotes: dto.allocated_votes,
      creditsUsed: cost,
      txIntentId: intent.id,
      status: 'pending',
    });
    await this.voteRepo.save(vote);

    return {
      xdr,
      txHash: tx.hash().toString('hex'),
      summary: {
        action: 'cast_philanthropic_vote',
        market: { id: market.id, title: market.title },
        ngo: { id: ngo.id, name: ngo.name },
        allocated_votes: dto.allocated_votes,
        credits_used: cost,
        credits_available: credits,
      },
    };
  }

  private async checkSpendingLimit(user: UserEntity, amount: number) {
    const windowStart = new Date(
      Date.now() - user.spendingWindowDays * 24 * 60 * 60 * 1000,
    );

    const result = await this.userPositionRepo
      .createQueryBuilder('up')
      .select('COALESCE(SUM(up.amount_staked), 0)', 'total')
      .where('up.user_id = :userId', { userId: user.id })
      .andWhere('up.created_at >= :windowStart', { windowStart })
      .andWhere("up.status = 'confirmed'")
      .getRawOne<{ total: string }>();

    const totalSpent = parseFloat(result?.total ?? '0');
    const remaining = Math.max(0, user.spendingLimitUsd - totalSpent);

    if (totalSpent + amount > user.spendingLimitUsd) {
      throw new ForbiddenException({
        error: 'SPENDING_LIMIT_EXCEEDED',
        message: `Spending limit exceeded. Your 30-day limit is ${user.spendingLimitUsd} USDC.`,
        remaining: remaining.toFixed(2),
        limit: user.spendingLimitUsd.toFixed(2),
        window_days: user.spendingWindowDays,
      });
    }
  }

  async submit(dto: SubmitTransactionDto) {
    // TODO: Actually submit to Stellar network
    // For now, return success mock
    return {
      success: true,
      status: 'pending_confirmation',
      message: 'Transaction received and being processed'
    };
  }
}

