import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

export type VoteStatus = 'pending' | 'confirmed' | 'failed';

@Entity('votes')
export class VoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Index()
  @Column({ name: 'market_id' })
  marketId: string;

  @Column({ name: 'ngo_id' })
  ngoId: string;

  @Column({ name: 'allocated_votes', type: 'int' })
  allocatedVotes: number;

  @Column({ name: 'credits_used', type: 'int' })
  creditsUsed: number;

  @Column({ name: 'tx_intent_id', nullable: true })
  txIntentId?: string;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'failed'], default: 'pending' })
  status: VoteStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
