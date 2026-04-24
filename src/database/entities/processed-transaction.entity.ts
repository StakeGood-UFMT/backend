import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

@Entity('processed_transactions')
@Index(['txHash', 'opIndex'], { unique: true })
export class ProcessedTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'tx_hash', length: 64 })
  txHash: string;

  @Column({ name: 'op_index', type: 'int' })
  opIndex: number;

  @Column({ name: 'event_type', length: 50 })
  eventType: string;

  @CreateDateColumn({ name: 'processed_at' })
  processedAt: Date;
}
