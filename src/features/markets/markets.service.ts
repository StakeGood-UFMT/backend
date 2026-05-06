import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getHistory(marketId: string, _interval: string, days: number) {
    const market = await this.marketRepo.findOne({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const snapshots = await this.snapshotRepo
      .createQueryBuilder('s')
      .where('s.market_id = :marketId', { marketId })
      .andWhere('s.timestamp >= :since', { since })
      .orderBy('s.timestamp', 'ASC')
      .getMany();

    if (!snapshots.length) {
      const positions = await this.userPositionRepo.find({
        where: { marketId },
        order: { createdAt: 'ASC' },
      });

      let yesPool = 0;
      let noPool = 0;
      let volume = 0;

      const points = positions
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

      return {
        market_id: marketId,
        title: market.title,
        derived_status: this.derivedStatus(market),
        snapshots: points,
      };
    }

    return {
      market_id: marketId,
      title: market.title,
      derived_status: this.derivedStatus(market),
      snapshots: snapshots.map((s) => ({
        timestamp: s.timestamp,
        yes_pool: s.yesPool,
        no_pool: s.noPool,
        yes_probability: s.impliedProbYes,
        no_probability: parseFloat((1 - s.impliedProbYes).toFixed(8)),
        trading_volume: s.tradingVolume ?? null,
      })),
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
}
