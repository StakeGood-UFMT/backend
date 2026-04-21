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

  @Index()
  @Column({ name: 'lock_at' })
  lockAt: Date;

  @Column({ name: 'resolve_at' })
  resolveAt: Date;

  @Column({ type: 'enum', enum: ['YES', 'NO'], nullable: true })
  outcome?: MarketOutcome;

  @Column({ name: 'oracle_ref', length: 200, nullable: true })
  oracleRef?: string;

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
