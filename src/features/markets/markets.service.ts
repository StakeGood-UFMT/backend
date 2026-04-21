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
      markets,
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
}
