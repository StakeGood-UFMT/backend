import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export type UserRole = 'user' | 'moderator' | 'admin';
export type KycStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type KycTier = 'individual' | 'business';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'primary_wallet', length: 56 })
  primaryWallet: string;

  @Column({
    type: 'enum',
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
  })
  role: UserRole;

  @Index()
  @Column({
    name: 'kyc_status',
    type: 'enum',
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending',
  })
  kycStatus: KycStatus;

  @Column({
    name: 'kyc_tier',
    type: 'enum',
    enum: ['individual', 'business'],
    default: 'individual',
  })
  kycTier: KycTier;

  @Column({ name: 'public_visibility', default: true })
  publicVisibility: boolean;

  @Column({ name: 'private_mode', default: false })
  privateMode: boolean;

  @Column({
    name: 'spending_limit_usd',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 500.0,
  })
  spendingLimitUsd: number;

  @Column({ name: 'spending_window_days', type: 'int', default: 30 })
  spendingWindowDays: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
