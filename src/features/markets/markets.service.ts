import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';

interface FindAllOptions {
  status?: string;
  category?: string;
  limit: number;
  offset: number;
  sort: string;
}

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @InjectRepository(MarketSnapshotEntity)
    private readonly snapshotRepo: Repository<MarketSnapshotEntity>,
  ) {}

  async findAll(options: FindAllOptions) {
    const query = this.marketRepo.createQueryBuilder('m');

    if (options.status) query.andWhere('m.status = :status', { status: options.status });
    if (options.category) query.andWhere('m.category = :category', { category: options.category });

    const orderMap: Record<string, string> = {
      newest: 'created_at DESC',
      oldest: 'created_at ASC',
    };
    const order = orderMap[options.sort] ?? 'created_at DESC';
    query.orderBy(`m.${order.split(' ')[0]}`, order.includes('ASC') ? 'ASC' : 'DESC');

    query.skip(options.offset).take(options.limit);

    const [markets, total] = await query.getManyAndCount();

    return {
      markets: markets.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        category: m.category,
        status: m.status,
        image_url: m.imageUrl,
        lock_at: m.lockAt,
        settle_at: m.resolveAt,
        created_at: m.createdAt,
      })),
      pagination: { total, limit: options.limit, offset: options.offset, has_next: options.offset + options.limit < total },
    };
  }

  async getHistory(marketId: string, _interval: string, days: number) {
    const market = await this.marketRepo.findOne({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const snapshots = await this.snapshotRepo.createQueryBuilder('s')
      .where('s.market_id = :marketId', { marketId })
      .andWhere('s.timestamp >= :since', { since })
      .orderBy('s.timestamp', 'ASC')
      .getMany();

    return {
      market_id: marketId,
      title: market.title,
      snapshots: snapshots.map((s) => ({
        timestamp: s.timestamp,
        yes_pool: s.yesPool,
        no_pool: s.noPool,
        yes_probability: s.impliedProbYes,
        trading_volume: s.tradingVolume,
      })),
    };
  }

  async findOne(id: string) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const latestSnapshot = await this.snapshotRepo.findOne({
      where: { marketId: id },
      order: { timestamp: 'DESC' },
    });

    const yesPool = Number(latestSnapshot?.yesPool || 1);
    const noPool = Number(latestSnapshot?.noPool || 1);
    const totalLiquidity = yesPool + noPool;

    return {
      id: market.id,
      title: market.title,
      description: market.description,
      category: market.category,
      status: market.status,
      image_url: market.imageUrl,
      yes_price: yesPool / totalLiquidity,
      no_price: noPool / totalLiquidity,
      total_liquidity: totalLiquidity.toFixed(2),
      lock_at: market.lockAt,
      settle_at: market.resolveAt,
      created_at: market.createdAt,
      resolution_rule: market.resolutionRule,
      resolution_source: market.resolutionSource,
      oracle_url: market.oracleUrl,
      contract_address: market.contractAddress,
      fee_ngo: Number(market.feeNgo),
      fee_platform: Number(market.feePlatform),
      fee_gamification: Number(market.feeGamification),
    };
  }
}
