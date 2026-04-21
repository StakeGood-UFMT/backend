import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { BuildPredictionDto } from './dto/build-prediction.dto';

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
  ) {}

  async buildPrediction(dto: BuildPredictionDto, jwtUser: any) {
    const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.kycStatus !== 'verified') {
      throw new ForbiddenException({ error: 'KYC_REQUIRED', kyc_status: user.kycStatus });
    }

    await this.checkSpendingLimit(user, parseFloat(dto.amount));

    const market = await this.marketRepo.findOne({ where: { id: dto.market_id } });
    if (!market) throw new NotFoundException('Market not found');
    if (market.status !== 'active') {
      throw new BadRequestException('Market is not active');
    }
    if (new Date() >= market.lockAt) {
      throw new BadRequestException('Market is locked for betting');
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

    // TODO: Build real Stellar XDR via stellar-sdk
    const xdr = 'PLACEHOLDER_XDR_BASE64';

    return {
      xdr,
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

    const result = await this.depositRepo
      .createQueryBuilder('d')
      .select('COALESCE(SUM(d.amount), 0)', 'total')
      .where('d.user_id = :userId', { userId: user.id })
      .andWhere('d.created_at >= :windowStart', { windowStart })
      .andWhere("d.status = 'confirmed'")
      .getRawOne<{ total: string }>();

    const totalSpent = parseFloat(result?.total ?? '0');
    const remaining = user.spendingLimitUsd - totalSpent;

    if (totalSpent + amount > user.spendingLimitUsd) {
      throw new ForbiddenException({
        error: 'SPENDING_LIMIT_EXCEEDED',
        remaining: remaining.toFixed(2),
      });
    }
  }
}
