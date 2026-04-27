import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('tx_receipts')
export class TxReceiptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'tx_hash' })
  txHash: string;

  @Column({ type: 'int', nullable: true })
  ledger: number;

  @Column()
  status: string;

  @Column({ name: 'result_xdr', type: 'text', nullable: true })
  resultXdr: string;

  @CreateDateColumn({ name: 'processed_at' })
  processedAt: Date;
}
