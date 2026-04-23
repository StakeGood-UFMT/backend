import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

@Entity('market_snapshots')
@Index(['marketId', 'timestamp'])
export class MarketSnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'market_id' })
  marketId: string;

  @Index()
  @Column()
  timestamp: Date;

  @Column({ name: 'yes_pool', type: 'decimal', precision: 18, scale: 8 })
  yesPool: number;

  @Column({ name: 'no_pool', type: 'decimal', precision: 18, scale: 8 })
  noPool: number;

  @Column({ name: 'trading_volume', type: 'decimal', precision: 18, scale: 8, nullable: true })
  tradingVolume?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  get impliedProbYes(): number {
    const yes = Number(this.yesPool);
    const no = Number(this.noPool);
    const total = yes + no;
    return total > 0 ? yes / total : 0.5;
  }
}
