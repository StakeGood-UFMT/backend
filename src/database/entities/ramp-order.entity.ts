import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type RampOrderType = 'ON_RAMP' | 'OFF_RAMP';
export type RampOrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired' | 'cancelled' | 'refunded';

@Entity('ramp_orders')
export class RampOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'order_id' })
  orderId: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'quote_id' })
  quoteId: string;

  @Column({ type: 'varchar', length: 20 })
  type: RampOrderType;

  @Index()
  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed', 'expired', 'cancelled', 'refunded'],
    default: 'pending',
  })
  status: RampOrderStatus;

  @Column({ name: 'from_amount', type: 'varchar', length: 50 })
  fromAmount: string;

  @Column({ name: 'from_currency', length: 100 })
  fromCurrency: string;

  @Column({ name: 'to_amount', type: 'varchar', length: 50 })
  toAmount: string;

  @Column({ name: 'to_currency', length: 100 })
  toCurrency: string;

  @Column({ name: 'fiat_account_id', nullable: true })
  fiatAccountId?: string;

  @Column({ name: 'payment_instructions', type: 'jsonb', nullable: true })
  paymentInstructions?: Record<string, any>;

  @Column({ name: 'signable_tx_xdr', type: 'text', nullable: true })
  signableTxXdr?: string;

  @Column({ name: 'stellar_tx_hash', length: 64, nullable: true })
  stellarTxHash?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
