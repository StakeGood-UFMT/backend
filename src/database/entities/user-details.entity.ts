import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

/**
 * UserDetailsEntity – extended preferences that live in a separate table
 * to keep UserEntity lean (1-to-1 relationship, shared userId PK pattern).
 *
 * Covers:
 *   • public_visibility    – show/hide the user on the leaderboard
 *   • spending_limit_usd   – self-imposed spending cap
 *   • linked_wallets       – JSON array of extra Stellar addresses linked via
 *                            signature challenge (BE-16 wallet linking)
 *   • totp_secret          – encrypted TOTP secret for 2FA (v2, optional)
 *   • totp_enabled         – whether 2FA is active
 */
@Entity('user_details')
export class UserDetailsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  /** Show this user on the public leaderboard. */
  @Column({ name: 'public_visibility', default: true })
  publicVisibility: boolean;

  /** Private mode hides positions from other users' views. */
  @Column({ name: 'private_mode', default: false })
  privateMode: boolean;

  /** Self-imposed max spend in USD per window. */
  @Column({
    name: 'spending_limit_usd',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 500.0,
  })
  spendingLimitUsd: number;

  /** Rolling window for the spending limit, in days. */
  @Column({ name: 'spending_window_days', type: 'int', default: 30 })
  spendingWindowDays: number;

  /**
   * Array of secondary Stellar wallets linked by the user via
   * signature-challenge (each element: { address: string, linkedAt: ISO8601 }).
   */
  @Column({
    name: 'linked_wallets',
    type: 'jsonb',
    default: [],
  })
  linkedWallets: Array<{ address: string; linkedAt: string }>;

  /**
   * TOTP secret stored encrypted at rest (v2 feature).
   * null means 2FA has never been configured.
   */
  @Column({ name: 'totp_secret', nullable: true, select: false })
  totpSecret?: string;

  /** Whether 2FA is currently active for this user. */
  @Column({ name: 'totp_enabled', default: false })
  totpEnabled: boolean;

  /** Temporary 2FA secret pending verification. */
  @Column({ name: 'pending_2fa_secret', nullable: true })
  pending2faSecret?: string;

  /** Expiration timestamp for the pending 2FA secret. */
  @Column({ name: 'pending_2fa_secret_expires_at', type: 'timestamp', nullable: true })
  pending2faSecretExpiresAt?: Date;

  /** Pending wallet connection signature challenges (address -> { nonce, expiresAt }). */
  @Column({ name: 'pending_challenges', type: 'jsonb', nullable: true, default: {} })
  pendingChallenges?: Record<string, { nonce: string; expiresAt: number }>;

  /** Version of terms accepted by the user. */
  @Column({ name: 'accepted_terms_version', nullable: true })
  acceptedTermsVersion?: string;

  /** When the user accepted the terms. */
  @Column({ name: 'accepted_terms_at', nullable: true })
  acceptedTermsAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
