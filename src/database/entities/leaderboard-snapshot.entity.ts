import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('leaderboard_snapshots')
export class LeaderboardSnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  timestamp: Date;

  @Column({ type: 'jsonb' })
  entries: Array<{
    userId: string;
    profit: number;
    volume: number;
    rank?: number;
  }>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
