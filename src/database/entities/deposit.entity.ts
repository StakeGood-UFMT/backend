import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type DepositStatus = 'pending' | 'confirmed' | 'failed';

@Entity('deposits')
export class DepositEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number;

  @Column({ length: 12, default: 'USDC' })
  currency: string;

  @Column({ name: 'tx_hash', length: 64, unique: true })
  txHash: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending',
  })
  status: DepositStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'confirmed_at', nullable: true })
  confirmedAt?: Date;
}
