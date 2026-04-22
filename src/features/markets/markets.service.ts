import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { ListMarketsQueryDto, MarketSortOption } from './dto/list-markets-query.dto';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @InjectRepository(MarketSnapshotEntity)
    private readonly snapshotRepo: Repository<MarketSnapshotEntity>,
  ) {}

  // SC allows state=OPEN after lock_ts, so we derive the UI status here
  derivedStatus(market: MarketEntity): string {
    if (market.status === 'active' && new Date() >= market.lockAt) return 'LOCKED';
    return market.status;
  }

  async findAll(query: ListMarketsQueryDto) {
    const { status, category, limit = 20, offset = 0, sort = MarketSortOption.NEWEST } = query;

    const qb = this.marketRepo.createQueryBuilder('m');

    if (status) qb.andWhere('m.status = :status', { status });
    if (category) qb.andWhere('m.category = :category', { category });

    const orderMap: Record<MarketSortOption, { col: string; dir: 'ASC' | 'DESC' }> = {
      [MarketSortOption.NEWEST]: { col: 'm.createdAt', dir: 'DESC' },
      [MarketSortOption.OLDEST]: { col: 'm.createdAt', dir: 'ASC' },
      [MarketSortOption.VOLUME]: { col: 'm.createdAt', dir: 'DESC' },
    };
    const { col, dir } = orderMap[sort] ?? orderMap[MarketSortOption.NEWEST];
    qb.orderBy(col, dir).skip(offset).take(limit);

    const [markets, total] = await qb.getManyAndCount();

    const latestSnapshots = await this.getLatestSnapshotsForMarkets(markets.map((m) => m.id));

    const items = markets.map((market) => {
      const snap = latestSnapshots.get(market.id);
      return {
        id: market.id,
        title: market.title,
        category: market.category,
        status: market.status,
        derived_status: this.derivedStatus(market),
        lock_at: market.lockAt,
        resolve_at: market.resolveAt,
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

    return {
      id: market.id,
      title: market.title,
      description: market.description ?? null,
      category: market.category ?? null,
      status: market.status,
      derived_status: this.derivedStatus(market),
      lock_at: market.lockAt,
      resolve_at: market.resolveAt,
      outcome: market.outcome ?? null,
      oracle_ref: market.oracleRef ?? null,
      asset_code: market.assetCode ?? null,
      asset_issuer: market.assetIssuer ?? null,
      current_prices: snap ? this.formatPrices(snap) : null,
      created_at: market.createdAt,
      updated_at: market.updatedAt,
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
