import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('tx_intents')
export class TxIntentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column()
  action: string;

  @Column({ type: 'text' })
  xdr: string;

  @Index()
  @Column({ name: 'tx_hash', nullable: true })
  txHash: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'signed' | 'submitted' | 'failed' | 'confirmed';

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
