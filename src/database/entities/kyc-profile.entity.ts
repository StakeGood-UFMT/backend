import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type KycProfileStatus = 'pending' | 'approved' | 'rejected' | 'expired';

@Entity('kyc_profiles')
export class KycProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'provider_id', length: 100 })
  providerId: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending',
  })
  status: KycProfileStatus;

  @Column({ name: 'verified_at', nullable: true })
  verifiedAt?: Date;

  @Column({ name: 'aml_flags', type: 'jsonb', default: {} })
  amlFlags: Record<string, any>;

  @Column({ name: 'raw_data', type: 'jsonb', nullable: true })
  rawData?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
