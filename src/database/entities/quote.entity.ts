import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('quotes')
export class QuoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'quote_id' })
  quoteId: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'from_currency', length: 100 })
  fromCurrency: string;

  @Column({ name: 'to_currency', length: 100 })
  toCurrency: string;

  @Column({ name: 'from_amount', type: 'varchar', length: 50 })
  fromAmount: string;

  @Column({ name: 'to_amount', type: 'varchar', length: 50 })
  toAmount: string;

  @Column({ name: 'exchange_rate', type: 'varchar', length: 50 })
  exchangeRate: string;

  @Column({ name: 'fee', type: 'varchar', length: 50, default: '0' })
  fee: string;

  @Column({ name: 'expires_at' })
  expiresAt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
