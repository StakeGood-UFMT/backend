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

export enum NgoProposalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('ngo_proposals')
export class NgoProposalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ length: 50, nullable: true })
  category?: string;

  @Index()
  @Column({ name: 'wallet_address', length: 56 })
  walletAddress: string;

  @Column({ name: 'website', length: 500, nullable: true })
  website?: string;

  @Column({ type: 'jsonb', default: {} })
  links: Record<string, any>;

  @Column({
    type: 'enum',
    enum: NgoProposalStatus,
    default: NgoProposalStatus.PENDING,
  })
  status: NgoProposalStatus;

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

  @Index()
  @Column({ name: 'reserved_on_chain_id', type: 'integer', nullable: true })
  reservedOnChainId?: number;

  @Column({ name: 'ngo_id', nullable: true })
  ngoId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
