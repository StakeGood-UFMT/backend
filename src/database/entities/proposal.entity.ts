import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum ProposalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('proposals')
export class ProposalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ length: 50, nullable: true })
  category?: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ name: 'oracle_url', type: 'text', nullable: true })
  oracleUrl?: string;

  @Column({ name: 'resolution_rule', type: 'text', nullable: true })
  resolutionRule?: string;

  @Column({ name: 'resolution_source', type: 'text', nullable: true })
  resolutionSource?: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.PENDING,
  })
  status: ProposalStatus;

  @Column({ name: 'lock_at', type: 'timestamp' })
  lockAt: Date;

  @Column({ name: 'resolve_at', type: 'timestamp' })
  resolveAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'moderated_by', nullable: true })
  moderatedBy?: string;

  @Column({ name: 'moderated_at', type: 'timestamp', nullable: true })
  moderatedAt?: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ name: 'reserved_on_chain_id', type: 'bigint', nullable: true })
  reservedOnChainId?: string;

  @Column({ name: 'market_id', nullable: true })
  marketId?: string;

  @Column({ name: 'ngo_candidate_ids', type: 'jsonb', default: [] })
  ngoCandidateIds: number[];

  @Column({ name: 'asset_code', length: 20, nullable: true })
  assetCode?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
