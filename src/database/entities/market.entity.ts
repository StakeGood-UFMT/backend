import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index,
} from 'typeorm';

export type MarketStatus = 'draft' | 'active' | 'locked' | 'resolved';
export type MarketOutcome = 'YES' | 'NO';

@Entity('markets')
export class MarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ length: 50, nullable: true })
  category?: string;

  @Index()
  @Column({ type: 'enum', enum: ['draft', 'active', 'locked', 'resolved'], default: 'draft' })
  status: MarketStatus;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ name: 'resolution_rule', type: 'text', nullable: true })
  resolutionRule?: string;

  @Column({ name: 'resolution_source', type: 'text', nullable: true })
  resolutionSource?: string;

  @Column({ name: 'oracle_url', type: 'text', nullable: true })
  oracleUrl?: string;

  @Column({ name: 'contract_address', length: 56, nullable: true })
  contractAddress?: string;

  @Column({ name: 'oracle_ref', length: 100, nullable: true })
  oracleRef?: string;

  @Column({ name: 'fee_ngo', type: 'decimal', precision: 5, scale: 4, default: 0.02 })
  feeNgo: number;

  @Column({ name: 'fee_platform', type: 'decimal', precision: 5, scale: 4, default: 0.01 })
  feePlatform: number;

  @Column({ name: 'fee_gamification', type: 'decimal', precision: 5, scale: 4, default: 0.005 })
  feeGamification: number;

  @Index()
  @Column({ name: 'lock_at' })
  lockAt: Date;

  @Column({ name: 'resolve_at' })
  resolveAt: Date;

  @Column({ type: 'enum', enum: ['YES', 'NO'], nullable: true })
  outcome?: MarketOutcome;

  @Column({ name: 'asset_code', length: 12, nullable: true })
  assetCode?: string;

  @Column({ name: 'asset_issuer', length: 56, nullable: true })
  assetIssuer?: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
