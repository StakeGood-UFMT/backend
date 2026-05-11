import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as StellarSdk from '@stellar/stellar-sdk';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { UserEntity } from '../../database/entities/user.entity';
import {
  ListMarketsQueryDto,
  MarketSortOption,
} from './dto/list-markets-query.dto';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @InjectRepository(MarketSnapshotEntity)
    private readonly snapshotRepo: Repository<MarketSnapshotEntity>,
    @InjectRepository(UserPositionEntity)
    private readonly userPositionRepo: Repository<UserPositionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly config: ConfigService,
  ) {}

  private getRpcServer(): StellarSdk.rpc.Server {
    const rpcUrl = this.config.get<string>(
      'STELLAR_RPC_URL',
      'https://soroban-testnet.stellar.org',
    );
    return new StellarSdk.rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith('http://'),
    });
  }

  private maskWallet(wallet: string) {
    if (!wallet) return '';
    if (wallet.length <= 12) return wallet;
    return `${wallet.slice(0, 5)}…${wallet.slice(-5)}`;
  }

  private async computePoolsFromPositions(marketId: string) {
    const row = await this.userPositionRepo
      .createQueryBuilder('p')
      .select(
        "COALESCE(SUM(CASE WHEN p.outcome = 'YES' THEN p.amount_staked ELSE 0 END), 0)",
        'yes',
      )
      .addSelect(
        "COALESCE(SUM(CASE WHEN p.outcome = 'NO' THEN p.amount_staked ELSE 0 END), 0)",
        'no',
      )
      .addSelect('COALESCE(SUM(p.amount_staked), 0)', 'total')
      .where('p.market_id = :marketId', { marketId })
      .andWhere("p.status IN ('pending','confirmed','resolved','claimed')")
      .getRawOne<{ yes: string; no: string; total: string }>();

    const yesPool = Number(row?.yes ?? 0);
    const noPool = Number(row?.no ?? 0);
    const totalLiquidity = Number(row?.total ?? yesPool + noPool);

    return { yesPool, noPool, totalLiquidity };
  }

  async listPositions(marketId: string, limit = 25, offset = 0) {
    const safeLimit = Math.max(1, Math.min(50, Number(limit) || 25));
    const safeOffset = Math.max(0, Number(offset) || 0);

    const [market, total] = await Promise.all([
      this.marketRepo.findOne({ where: { id: marketId } }),
      this.userPositionRepo.count({ where: { marketId } }),
    ]);
    if (!market) throw new NotFoundException('Market not found');

    const positions = await this.userPositionRepo.find({
      where: { marketId },
      order: { createdAt: 'DESC' },
      take: safeLimit,
      skip: safeOffset,
    });

    const userIds = Array.from(new Set(positions.map((p) => p.userId)));
    const users = userIds.length
      ? await this.userRepo.findBy({ id: In(userIds) })
      : [];
    const usersById = new Map(users.map((u) => [u.id, u]));

    const rpc = this.getRpcServer();

    const chainStatuses = await Promise.all(
      positions.map(async (p) => {
        if (!p.txHash) return { txHash: null, status: 'unknown' as const };
        try {
          const result: any = await rpc.getTransaction(p.txHash);
          const rawStatus = String(result?.status ?? '').toUpperCase();
          const status =
            rawStatus === 'SUCCESS'
              ? 'confirmed'
              : rawStatus === 'FAILED' || rawStatus === 'ERROR'
                ? 'failed'
                : 'pending';
          return { txHash: p.txHash, status };
        } catch {
          return { txHash: p.txHash, status: 'unknown' as const };
        }
      }),
    );
    const chainByHash = new Map(chainStatuses.map((s) => [s.txHash, s.status]));

    const items = positions.map((p) => {
      const user = usersById.get(p.userId);
      const publicVisibility = user?.publicVisibility ?? false;
      const privateMode = user?.privateMode ?? false;
      const wallet = user?.primaryWallet ?? '';
      const display =
        publicVisibility && wallet ? this.maskWallet(wallet) : 'Anonymous';

      return {
        id: p.id,
        user: {
          display,
          wallet: publicVisibility ? wallet : null,
          public_visibility: publicVisibility,
          private_mode: privateMode,
        },
        outcome: p.outcome,
        amount: privateMode ? null : Number(p.amountStaked),
        position_status: p.status,
        tx_hash: p.txHash ?? null,
        chain_status: p.txHash ? chainByHash.get(p.txHash) ?? 'unknown' : 'unknown',
        created_at: p.createdAt,
      };
    });

    return {
      market_id: marketId,
      positions: items,
      pagination: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        has_next: safeOffset + safeLimit < total,
      },
    };
  }

  async getResults(marketId: string) {
    const market = await this.marketRepo.findOne({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    const snap = await this.snapshotRepo
      .createQueryBuilder('s')
      .where('s.market_id = :id', { id: marketId })
      .orderBy('s.timestamp', 'DESC')
      .limit(1)
      .getOne();

    let yesPool = Number(snap?.yesPool ?? 0);
    let noPool = Number(snap?.noPool ?? 0);
    let totalLiquidity = yesPool + noPool;

    if (!snap) {
      const computed = await this.computePoolsFromPositions(marketId);
      yesPool = computed.yesPool;
      noPool = computed.noPool;
      totalLiquidity = computed.totalLiquidity;
    }

    const outcome = market.outcome ?? null;
    const resolved = market.status === 'resolved' && (outcome === 'YES' || outcome === 'NO');
    const closed = new Date() >= market.lockAt || market.status === 'locked' || market.status === 'resolved';

    if (!resolved) {
      if (!closed) {
        return {
          market_id: marketId,
          resolved: false,
          closed: false,
          status: market.status,
          outcome,
          pools: {
            yes_pool: yesPool,
            no_pool: noPool,
            total_liquidity: totalLiquidity,
          },
        };
      }

      const feeNgo = Number(market.feeNgo ?? 0);
      const feePlatform = Number(market.feePlatform ?? 0);
      const feeGamification = Number(market.feeGamification ?? 0);
      const totalFeePct = Math.max(0, feeNgo + feePlatform + feeGamification);

      if (totalFeePct > 1.0) {
        throw new BadRequestException('Invalid market fee configuration');
      }

      const positions = await this.userPositionRepo.find({
        where: {
          marketId,
          status: In(['pending', 'confirmed', 'resolved', 'claimed']),
        },
      });

      const userIds = Array.from(new Set(positions.map((p) => p.userId)));
      const users = userIds.length ? await this.userRepo.findBy({ id: In(userIds) }) : [];
      const usersById = new Map(users.map((u) => [u.id, u]));

      const stakeByUserOutcome = new Map<'YES' | 'NO', Map<string, number>>([
        ['YES', new Map()],
        ['NO', new Map()],
      ]);

      for (const p of positions) {
        const outcomeKey = p.outcome;
        const byUser = stakeByUserOutcome.get(outcomeKey);
        if (!byUser) continue;
        const current = byUser.get(p.userId) ?? 0;
        byUser.set(p.userId, current + Number(p.amountStaked));
      }

      const buildScenario = (winningOutcome: 'YES' | 'NO') => {
        const winningPool = winningOutcome === 'YES' ? yesPool : noPool;
        const losingPool = winningOutcome === 'YES' ? noPool : yesPool;

        const feeNgoAmount = losingPool * feeNgo;
        const feePlatformAmount = losingPool * feePlatform;
        const feeGamificationAmount = losingPool * feeGamification;
        const totalFeeAmount =
          feeNgoAmount + feePlatformAmount + feeGamificationAmount;

        const netLosingPool = Math.max(0, losingPool - totalFeeAmount);
        const winnersProfitTotal = netLosingPool;
        const winnersTotalPayout = winningPool + netLosingPool;

        const winnersByUser = stakeByUserOutcome.get(winningOutcome) ?? new Map();
        const winners = Array.from(winnersByUser.entries())
          .map(([userId, investedRaw]) => {
            const invested = Number(investedRaw ?? 0);
            const user = usersById.get(userId);
            const publicVisibility = user?.publicVisibility ?? false;
            const privateMode = user?.privateMode ?? false;
            const wallet = publicVisibility ? (user?.primaryWallet ?? null) : null;

            if (privateMode) {
              return {
                user_id: userId,
                wallet,
                invested: null,
                payout: null,
                profit: null,
              };
            }

            const profit =
              winningPool > 0 ? (netLosingPool * invested) / winningPool : 0;
            const payout = invested + profit;
            return {
              user_id: userId,
              wallet,
              invested: Number(invested.toFixed(8)),
              payout: Number(payout.toFixed(8)),
              profit: Number(profit.toFixed(8)),
            };
          })
          .sort((a, b) => (b.payout ?? -1) - (a.payout ?? -1));

        return {
          outcome: winningOutcome,
          pools: {
            winning_pool: winningPool,
            losing_pool: losingPool,
          },
          fees: {
            charity: { pct: feeNgo, amount: Number(feeNgoAmount.toFixed(8)) },
            platform: {
              pct: feePlatform,
              amount: Number(feePlatformAmount.toFixed(8)),
            },
            gamification: {
              pct: feeGamification,
              amount: Number(feeGamificationAmount.toFixed(8)),
            },
            total: {
              pct: totalFeePct,
              amount: Number(totalFeeAmount.toFixed(8)),
            },
          },
          winners_total_payout: Number(winnersTotalPayout.toFixed(8)),
          winners_profit_total: Number(winnersProfitTotal.toFixed(8)),
          winners,
        };
      };

      return {
        market_id: marketId,
        resolved: false,
        closed: true,
        status: market.status,
        outcome,
        pools: {
          yes_pool: yesPool,
          no_pool: noPool,
          total_liquidity: totalLiquidity,
        },
        projections: {
          YES: buildScenario('YES'),
          NO: buildScenario('NO'),
        },
      };
    }

    const winningPool = outcome === 'YES' ? yesPool : noPool;
    const losingPool = outcome === 'YES' ? noPool : yesPool;

    const feeNgo = Number(market.feeNgo ?? 0);
    const feePlatform = Number(market.feePlatform ?? 0);
    const feeGamification = Number(market.feeGamification ?? 0);
    const totalFeePct = Math.max(0, feeNgo + feePlatform + feeGamification);

    const feeNgoAmount = losingPool * feeNgo;
    const feePlatformAmount = losingPool * feePlatform;
    const feeGamificationAmount = losingPool * feeGamification;
    const totalFeeAmount = feeNgoAmount + feePlatformAmount + feeGamificationAmount;

    const netLosingPool = Math.max(0, losingPool - totalFeeAmount);
    const winnersProfitTotal = netLosingPool;
    const winnersTotalPayout = winningPool + netLosingPool;

    const winnerPositions = await this.userPositionRepo.find({
      where: {
        marketId,
        outcome,
        status: In(['pending', 'confirmed', 'resolved', 'claimed']),
      },
    });

    const winnersByUserId = new Map<string, number>();
    for (const p of winnerPositions) {
      const current = winnersByUserId.get(p.userId) ?? 0;
      winnersByUserId.set(p.userId, current + Number(p.amountStaked));
    }

    const winnerUserIds = Array.from(winnersByUserId.keys());
    const winnerUsers = winnerUserIds.length
      ? await this.userRepo.findBy({ id: In(winnerUserIds) })
      : [];
    const usersById = new Map(winnerUsers.map((u) => [u.id, u]));

    const winners = winnerUserIds
      .map((userId) => {
        const invested = winnersByUserId.get(userId) ?? 0;
        const user = usersById.get(userId);
        const publicVisibility = user?.publicVisibility ?? false;
        const wallet = publicVisibility ? (user?.primaryWallet ?? null) : null;
        const profit =
          winningPool > 0 ? (netLosingPool * invested) / winningPool : 0;
        const payout = invested + profit;
        return {
          user_id: userId,
          wallet,
          invested: Number(invested.toFixed(8)),
          payout: Number(payout.toFixed(8)),
          profit: Number(profit.toFixed(8)),
        };
      })
      .sort((a, b) => b.payout - a.payout);

    if (totalFeePct > 1.0) {
      throw new BadRequestException('Invalid market fee configuration');
    }

    return {
      market_id: marketId,
      resolved: true,
      outcome,
      pools: {
        yes_pool: yesPool,
        no_pool: noPool,
        winning_pool: winningPool,
        losing_pool: losingPool,
        total_liquidity: totalLiquidity,
      },
      fees: {
        charity: { pct: feeNgo, amount: Number(feeNgoAmount.toFixed(8)) },
        platform: {
          pct: feePlatform,
          amount: Number(feePlatformAmount.toFixed(8)),
        },
        gamification: {
          pct: feeGamification,
          amount: Number(feeGamificationAmount.toFixed(8)),
        },
        total: { pct: totalFeePct, amount: Number(totalFeeAmount.toFixed(8)) },
      },
      winners_total_payout: Number(winnersTotalPayout.toFixed(8)),
      winners_profit_total: Number(winnersProfitTotal.toFixed(8)),
      winners,
    };
  }

  // SC allows state=OPEN after lock_ts, so we derive the UI status here
  derivedStatus(market: MarketEntity): string {
    if (market.status === 'active' && new Date() >= market.lockAt)
      return 'LOCKED';
    return market.status;
  }

  async findAll(query: ListMarketsQueryDto) {
    const {
      status,
      category,
      limit = 20,
      offset = 0,
      sort = MarketSortOption.NEWEST,
    } = query;

    const qb = this.marketRepo.createQueryBuilder('m');

    if (status) qb.andWhere('m.status = :status', { status });
    if (category) qb.andWhere('m.category = :category', { category });

    const orderMap: Record<
      MarketSortOption,
      { col: string; dir: 'ASC' | 'DESC' }
    > = {
      [MarketSortOption.NEWEST]: { col: 'm.createdAt', dir: 'DESC' },
      [MarketSortOption.OLDEST]: { col: 'm.createdAt', dir: 'ASC' },
      [MarketSortOption.VOLUME]: { col: 'm.createdAt', dir: 'DESC' },
    };
    const { col, dir } = orderMap[sort] ?? orderMap[MarketSortOption.NEWEST];
    qb.orderBy(col, dir).skip(offset).take(limit);

    const [markets, total] = await qb.getManyAndCount();

    const latestSnapshots = await this.getLatestSnapshotsForMarkets(
      markets.map((m) => m.id),
    );

    const items = markets.map((market) => {
      const snap = latestSnapshots.get(market.id);
      return {
        id: market.id,
        title: market.title,
        description: market.description,
        category: market.category,
        status: market.status,
        derived_status: this.derivedStatus(market),
        image_url: market.imageUrl,
        lock_at: market.lockAt,
        settle_at: market.resolveAt,
        outcome: market.outcome ?? null,
        asset_code: market.assetCode ?? null,
        current_prices: snap ? this.formatPrices(snap) : null,
        created_at: market.createdAt,
      };
    });

    return {
      markets: items,
      pagination: { total, limit, offset, has_next: offset + limit < total },
    };
  }

  async findOne(id: string) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const snap = await this.snapshotRepo
      .createQueryBuilder('s')
      .where('s.market_id = :id', { id })
      .orderBy('s.timestamp', 'DESC')
      .limit(1)
      .getOne();

    let yesPool = Number(snap?.yesPool ?? 0);
    let noPool = Number(snap?.noPool ?? 0);
    let totalLiquidity = yesPool + noPool;

    if (!snap) {
      const computed = await this.computePoolsFromPositions(id);
      yesPool = computed.yesPool;
      noPool = computed.noPool;
      totalLiquidity = computed.totalLiquidity;
    }

    if (totalLiquidity <= 0) {
      yesPool = 1;
      noPool = 1;
      totalLiquidity = 2;
    }

    return {
      id: market.id,
      title: market.title,
      description: market.description ?? null,
      category: market.category ?? null,
      status: market.status,
      derived_status: this.derivedStatus(market),
      image_url: market.imageUrl,
      lock_at: market.lockAt,
      settle_at: market.resolveAt,
      outcome: market.outcome ?? null,
      oracle_ref: market.oracleRef ?? null, // V3 field
      oracle_url: market.oracleUrl ?? null, // BE-21 field
      asset_code: market.assetCode ?? null,
      asset_issuer: market.assetIssuer ?? null,
      contract_address: market.contractAddress ?? null,
      fee_ngo: Number(market.feeNgo),
      fee_platform: Number(market.feePlatform),
      fee_gamification: Number(market.feeGamification),
      yes_price: yesPool / totalLiquidity, // Convenience price from main
      no_price: noPool / totalLiquidity, // Convenience price from main
      yes_pool: yesPool,
      no_pool: noPool,
      total_liquidity: totalLiquidity.toFixed(2),
      current_prices: snap ? this.formatPrices(snap) : null,
      created_at: market.createdAt,
      updated_at: market.updatedAt,
      resolution_rule: market.resolutionRule,
      resolution_source: market.resolutionSource,
    };
  }

  async getHistory(
    marketId: string,
    range?: string,
    _interval: string = '1h',
    days: number = 7,
  ) {
    const market = await this.marketRepo.findOne({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    const normalizedRange = (range ?? '').toUpperCase();

    const now = Date.now();
    const msMinute = 60 * 1000;
    const msHour = 60 * msMinute;
    const msDay = 24 * msHour;

    const since =
      normalizedRange === '1H'
        ? new Date(now - 60 * msMinute)
        : normalizedRange === '1D'
          ? new Date(now - 24 * msHour)
          : normalizedRange === '1W'
            ? new Date(now - 7 * msDay)
            : new Date(now - days * msDay);

    const snapshots = await this.snapshotRepo
      .createQueryBuilder('s')
      .where('s.market_id = :marketId', { marketId })
      .andWhere('s.timestamp >= :since', { since })
      .orderBy('s.timestamp', 'ASC')
      .getMany();

    let points: Array<{
      timestamp: Date;
      yes_pool: number;
      no_pool: number;
      yes_probability: number;
      no_probability: number;
      trading_volume: number | null;
    }> = [];

    let useSnapshots = snapshots.length > 0;
    if (useSnapshots) {
      const last = snapshots[snapshots.length - 1];
      const snapYes = Number(last?.yesPool ?? 0);
      const snapNo = Number(last?.noPool ?? 0);
      const snapTotal = snapYes + snapNo;

      const computed = await this.computePoolsFromPositions(marketId);
      const computedTotal = Number(computed.totalLiquidity ?? 0);

      if (computedTotal > 0) {
        if (snapTotal <= 0) useSnapshots = false;
        else if (Math.abs(computedTotal - snapTotal) > 1e-8) useSnapshots = false;
      }
    }

    if (!useSnapshots) {
      const positions = await this.userPositionRepo.find({
        where: { marketId },
        order: { createdAt: 'ASC' },
      });

      let yesPool = 0;
      let noPool = 0;
      let volume = 0;

      points = positions
        .filter((p) => p.createdAt >= since && p.status !== 'cancelled')
        .map((p) => {
          const amt = Number(p.amountStaked);
          volume += amt;
          if (p.outcome === 'YES') yesPool += amt;
          else noPool += amt;
          const total = yesPool + noPool;
          const yesProb = total > 0 ? yesPool / total : 0.5;
          return {
            timestamp: p.createdAt,
            yes_pool: yesPool,
            no_pool: noPool,
            yes_probability: parseFloat(yesProb.toFixed(8)),
            no_probability: parseFloat((1 - yesProb).toFixed(8)),
            trading_volume: volume,
          };
        });
    } else {
      points = snapshots.map((s) => ({
        timestamp: s.timestamp,
        yes_pool: Number(s.yesPool),
        no_pool: Number(s.noPool),
        yes_probability: parseFloat(Number(s.impliedProbYes).toFixed(8)),
        no_probability: parseFloat((1 - Number(s.impliedProbYes)).toFixed(8)),
        trading_volume: s.tradingVolume ?? null,
      }));
    }

    const maxPointTs = points.reduce((acc, p) => {
      const t = p.timestamp?.getTime?.();
      return typeof t === 'number' && Number.isFinite(t) ? Math.max(acc, t) : acc;
    }, 0);
    const anchorNow = maxPointTs > 0 ? Math.max(now, maxPointTs) : now;

    if (normalizedRange === '1H') {
      const series = this.resampleMarketHistory(points, anchorNow, msMinute, 60);
      return {
        market_id: marketId,
        title: market.title,
        derived_status: this.derivedStatus(market),
        snapshots: series,
      };
    }

    if (normalizedRange === '1D') {
      const series = this.resampleMarketHistory(points, anchorNow, msHour, 24);
      return {
        market_id: marketId,
        title: market.title,
        derived_status: this.derivedStatus(market),
        snapshots: series,
      };
    }

    if (normalizedRange === '1W') {
      const series = this.resampleMarketHistory(points, anchorNow, msDay, 7);
      return {
        market_id: marketId,
        title: market.title,
        derived_status: this.derivedStatus(market),
        snapshots: series,
      };
    }

    return {
      market_id: marketId,
      title: market.title,
      derived_status: this.derivedStatus(market),
      snapshots: points,
    };
  }

  private async getLatestSnapshotsForMarkets(
    marketIds: string[],
  ): Promise<Map<string, MarketSnapshotEntity>> {
    if (!marketIds.length) return new Map();

    // Subquery: pick the most recent snapshot per market
    const rows = await this.snapshotRepo
      .createQueryBuilder('s')
      .where('s.market_id IN (:...ids)', { ids: marketIds })
      .distinctOn(['s.market_id'])
      .orderBy('s.market_id')
      .addOrderBy('s.timestamp', 'DESC')
      .getMany();

    return new Map(rows.map((r) => [r.marketId, r]));
  }

  private formatPrices(snap: MarketSnapshotEntity) {
    const yesProbability = snap.impliedProbYes;
    return {
      yes_probability: parseFloat(yesProbability.toFixed(8)),
      no_probability: parseFloat((1 - yesProbability).toFixed(8)),
      yes_pool: snap.yesPool,
      no_pool: snap.noPool,
      trading_volume: snap.tradingVolume ?? null,
    };
  }

  private resampleMarketHistory(
    points: Array<{
      timestamp: Date;
      yes_pool: number;
      no_pool: number;
      yes_probability: number;
      no_probability: number;
      trading_volume: number | null;
    }>,
    nowMs: number,
    bucketMs: number,
    count: number,
  ) {
    const sorted = [...(points ?? [])].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );

    const startMs = nowMs - count * bucketMs;
    const out: Array<{
      timestamp: Date;
      yes_pool: number;
      no_pool: number;
      yes_probability: number;
      no_probability: number;
      trading_volume: number | null;
    }> = [];

    let idx = 0;
    let yes = 0;
    let no = 0;
    let vol: number | null = null;

    for (let i = 0; i < count; i++) {
      const bucketEnd = startMs + (i + 1) * bucketMs;
      while (idx < sorted.length && sorted[idx].timestamp.getTime() <= bucketEnd) {
        yes = Number(sorted[idx].yes_pool ?? 0);
        no = Number(sorted[idx].no_pool ?? 0);
        vol = sorted[idx].trading_volume ?? vol;
        idx++;
      }

      const total = yes + no;
      const yesProb = total > 0 ? yes / total : 0.5;
      out.push({
        timestamp: new Date(bucketEnd),
        yes_pool: yes,
        no_pool: no,
        yes_probability: parseFloat(yesProb.toFixed(8)),
        no_probability: parseFloat((1 - yesProb).toFixed(8)),
        trading_volume: vol,
      });
    }

    return out;
  }
}
