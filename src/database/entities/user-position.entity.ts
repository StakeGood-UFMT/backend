import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index,
} from 'typeorm';

export type PositionOutcome = 'YES' | 'NO';
export type PositionStatus = 'pending' | 'confirmed' | 'cancelled' | 'resolved' | 'claimed';

@Entity('user_positions')
export class UserPositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'market_id' })
  marketId: string;

  @Column({ type: 'enum', enum: ['YES', 'NO'] })
  outcome: PositionOutcome;

  @Column({ name: 'amount_staked', type: 'decimal', precision: 18, scale: 8 })
  amountStaked: number;

  @Index()
  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'resolved', 'claimed'], default: 'pending' })
  status: PositionStatus;

  @Index()
  @Column({ name: 'tx_hash', length: 64, nullable: true })
  txHash?: string;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt?: Date;

  @Column({ name: 'payout_amount', type: 'decimal', precision: 18, scale: 8, nullable: true })
  payoutAmount?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
