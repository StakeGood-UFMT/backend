import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('ngos')
export class NgoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'on_chain_id', type: 'integer', nullable: true })
  onChainId?: number;

  @Column({ unique: true, length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ length: 50, nullable: true })
  category?: string;

  @Index()
  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'verification_date', nullable: true })
  verificationDate?: Date;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy?: string;

  @Column({ name: 'wallet_address', length: 56 })
  walletAddress: string;

  @Column({ length: 500, nullable: true })
  website?: string;

  @Column({ type: 'jsonb', default: {} })
  social: Record<string, any>;

  @Column({ name: 'impact_metrics', type: 'jsonb', default: {} })
  impactMetrics: Record<string, any>;

  @Column({
    name: 'total_funds_received',
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: 0,
  })
  totalFundsReceived: number;

  @Column({ type: 'jsonb', default: {} })
  balances: Record<string, number>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
