import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type LedgerSource =
  | 'quadratic_voting'
  | 'donation'
  | 'grant'
  | 'fee_pool';

@Entity('impact_ledger_entries')
export class ImpactLedgerEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  date: Date;

  @Column({ name: 'market_id', nullable: true })
  marketId?: string;

  @Index()
  @Column({ name: 'ngo_id' })
  ngoId: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number;

  @Column({ length: 12, default: 'USDC' })
  currency: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ['quadratic_voting', 'donation', 'grant', 'fee_pool'],
    default: 'quadratic_voting',
  })
  source: LedgerSource;

  @Column({ name: 'tx_hash', length: 64, nullable: true })
  txHash?: string;

  @Column({ type: 'jsonb', nullable: true })
  breakdown?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
