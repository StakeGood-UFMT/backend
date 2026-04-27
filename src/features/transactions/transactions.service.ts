import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as StellarSdk from '@stellar/stellar-sdk';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { BuildPredictionDto } from './dto/build-prediction.dto';
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
  ) {}

  async buildPrediction(dto: BuildPredictionDto, jwtUser: any) {
    const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
    if (!user) throw new NotFoundException('User not found');

    // Validation: KYC Status
    if (user.kycStatus !== 'verified') {
      throw new ForbiddenException({
        error: 'KYC_REQUIRED',
        kyc_status: user.kycStatus,
        message: 'Verified KYC is required to place predictions.',
      });
    }

    // Validation: Spending Limit (BE-6A)
    await this.checkSpendingLimit(user, parseFloat(dto.amount));

    const market = await this.marketRepo.findOne({
      where: { id: dto.market_id },
    });
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
        message:
          'Hedging is not allowed. You already have a position on the opposite outcome in this market.',
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
    const payoutMultiplier =
      dto.outcome === 'YES'
        ? (yesPool + noPool + amount) / (yesPool + amount)
        : (yesPool + noPool + amount) / (noPool + amount);
    const potentialWin = amount * payoutMultiplier;

    // Soroban XDR Generation
    // Function: place_prediction(user: Address, market_id: u64, outcome: u32, amount: i128)
    const contractId =
      market.contractAddress ||
      'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4'; // Placeholder if not set
    const amountStroops = BigInt(Math.floor(amount * 10000000)); // 7 decimals for USDC/SAC

    const marketIdU64 = BigInt(market.onChainId || 0);
    const outcomeU32 = dto.outcome === 'YES' ? 1 : 2;

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'place_prediction',
          args: [
            StellarSdk.nativeToScVal(
              new StellarSdk.Address(user.primaryWallet),
            ),
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
      { fee: '10000', networkPassphrase: StellarSdk.Networks.TESTNET },
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
      message: 'Transaction received and being processed',
    };
  }
}
