import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { TxReceiptEntity } from '../../database/entities/tx-receipt.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(UserPositionEntity)
    private readonly positionRepo: Repository<UserPositionEntity>,

    @InjectRepository(TxReceiptEntity)
    private readonly txReceiptRepo: Repository<TxReceiptEntity>,
  ) {}

  private async assertUserExists(userId: string): Promise<void> {
    const exists = await this.userRepo.existsBy({ id: userId });
    if (!exists) throw new NotFoundException('User not found');
  }

  async getPortfolio(userId: string, query: PaginationQueryDto) {
    await this.assertUserExists(userId);
    const [items, total] = await this.positionRepo
      .createQueryBuilder('pos')
      .innerJoin(MarketEntity, 'mkt', 'mkt.id = pos.marketId')
      .select([
        'pos.id          AS "id"',
        'pos.marketId    AS "marketId"',
        'mkt.title       AS "marketTitle"',
        'mkt.status      AS "marketStatus"',
        'mkt.outcome     AS "marketOutcome"',
        'pos.outcome     AS "outcome"',
        'pos.amountStaked AS "amountStaked"',
        'pos.status      AS "status"',
        'pos.payoutAmount AS "payoutAmount"',
        'pos.txHash      AS "txHash"',
        'pos.createdAt   AS "createdAt"',
      ])
      .where('pos.userId = :userId', { userId })
      .andWhere('pos.status IN (:...statuses)', {
        statuses: ['confirmed', 'resolved', 'claimed'],
      })
      .orderBy('pos.createdAt', 'DESC')
      .limit(query.limit)
      .offset(query.offset)
      .getRawMany()
      .then(async (rows) => {
        const count = await this.positionRepo
          .createQueryBuilder('pos')
          .where('pos.userId = :userId', { userId })
          .andWhere('pos.status IN (:...statuses)', {
            statuses: ['confirmed', 'resolved', 'claimed'],
          })
          .getCount();
        return [rows, count] as const;
      });

    return { data: items, total, limit: query.limit, offset: query.offset };
  }

  async getHistory(userId: string, query: PaginationQueryDto) {
    await this.assertUserExists(userId);
    const hashes = await this.positionRepo
      .createQueryBuilder('pos')
      .select('pos.txHash', 'txHash')
      .where('pos.userId = :userId', { userId })
      .andWhere('pos.txHash IS NOT NULL')
      .getRawMany()
      .then((rows) => rows.map((r) => r.txHash as string));

    if (hashes.length === 0) {
      return { data: [], total: 0, limit: query.limit, offset: query.offset };
    }

    const [items, total] = await this.txReceiptRepo.findAndCount({
      where: hashes.map((h) => ({ txHash: h })),
      order: { processedAt: 'DESC' },
      take: query.limit,
      skip: query.offset,
    });

    return { data: items, total, limit: query.limit, offset: query.offset };
  }

  async getClaims(userId: string, query: PaginationQueryDto) {
    await this.assertUserExists(userId);
    const [items, total] = await this.positionRepo
      .createQueryBuilder('pos')
      .innerJoin(MarketEntity, 'mkt', 'mkt.id = pos.marketId')
      .select([
        'pos.id          AS "id"',
        'pos.marketId    AS "marketId"',
        'mkt.title       AS "marketTitle"',
        'pos.outcome     AS "outcome"',
        'pos.amountStaked AS "amountStaked"',
        'pos.payoutAmount AS "payoutAmount"',
        'pos.txHash      AS "txHash"',
        'pos.resolvedAt  AS "resolvedAt"',
      ])
      .where('pos.userId = :userId', { userId })
      .andWhere('pos.status = :status', { status: 'resolved' })
      .andWhere('pos.payoutAmount IS NOT NULL')
      .andWhere('mkt.status = :mktStatus', { mktStatus: 'resolved' })
      .orderBy('pos.resolvedAt', 'DESC')
      .limit(query.limit)
      .offset(query.offset)
      .getRawMany()
      .then(async (rows) => {
        const count = await this.positionRepo
          .createQueryBuilder('pos')
          .innerJoin(MarketEntity, 'mkt', 'mkt.id = pos.marketId')
          .where('pos.userId = :userId', { userId })
          .andWhere('pos.status = :status', { status: 'resolved' })
          .andWhere('pos.payoutAmount IS NOT NULL')
          .andWhere('mkt.status = :mktStatus', { mktStatus: 'resolved' })
          .getCount();
        return [rows, count] as const;
      });

    return { data: items, total, limit: query.limit, offset: query.offset };
  }
}
