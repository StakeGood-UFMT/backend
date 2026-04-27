import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeaderboardSnapshotEntity } from '../../database/entities/leaderboard-snapshot.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    @InjectRepository(LeaderboardSnapshotEntity)
    private readonly snapshotRepo: Repository<LeaderboardSnapshotEntity>,
    @InjectRepository(UserPositionEntity)
    private readonly positionRepo: Repository<UserPositionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailySnapshot() {
    this.logger.log('Executando snapshot diário do Leaderboard');
    try {
      const raw = await this.positionRepo
        .createQueryBuilder('p')
        .select('p.userId', 'userId')
        .addSelect(
          'SUM(COALESCE(p.payout_amount, 0) - COALESCE(p.amount_staked, 0))',
          'profit',
        )
        .addSelect('SUM(COALESCE(p.amount_staked, 0))', 'volume')
        .where('p.status IN (:...s)', { s: ['resolved', 'claimed'] })
        .groupBy('p.userId')
        .orderBy('profit', 'DESC')
        .limit(100)
        .getRawMany<{
          userId: string;
          profit: string | number;
          volume: string | number;
        }>();

      const userIds = raw.map((r) => r.userId).filter(Boolean);
      if (userIds.length === 0) {
        this.logger.log('Nenhum dado para leaderboard neste snapshot');
        await this.snapshotRepo.save({ timestamp: new Date(), entries: [] });
        return;
      }

      const users = await this.userRepo.find({ where: { id: In(userIds) } });
      const privateSet = new Set(
        users.filter((u) => u.privateMode).map((u) => u.id),
      );

      const entries = raw
        .map((r, idx) => ({
          userId: r.userId,
          profit: Number(r.profit) || 0,
          volume: Number(r.volume) || 0,
          rank: idx + 1,
        }))
        .filter((e) => !privateSet.has(e.userId))
        .slice(0, 50);

      const snapshot = this.snapshotRepo.create({
        timestamp: new Date(),
        entries,
      });

      await this.snapshotRepo.save(snapshot);
      this.logger.log(
        `Leaderboard snapshot salvo com ${entries.length} entradas.`,
      );
    } catch (error) {
      const err = error as Error | undefined;
      this.logger.error(
        'Erro ao gerar snapshot do leaderboard',
        err?.stack ?? err?.message,
      );
    }
  }

  async getSnapshots(opts: { from?: string; to?: string; limit?: number }) {
    const qb = this.snapshotRepo
      .createQueryBuilder('s')
      .orderBy('s.timestamp', 'DESC');
    if (opts.from)
      qb.andWhere('s.timestamp >= :from', { from: new Date(opts.from) });
    if (opts.to) qb.andWhere('s.timestamp <= :to', { to: new Date(opts.to) });
    if (opts.limit) qb.limit(opts.limit);
    return qb.getMany();
  }
}
