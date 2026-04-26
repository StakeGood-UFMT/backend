import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index,
} from 'typeorm';

export type ClaimStatus = 'pending' | 'submitted' | 'confirmed' | 'failed';

@Entity('claims')
export class ClaimEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Index()
  @Column({ name: 'market_id' })
  marketId: string;

  @Column({ name: 'position_id' })
  positionId: string;

  @Column({ type: 'text' })
  xdr: string;

  @Index()
  @Column({ name: 'tx_hash', length: 64, nullable: true })
  txHash?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'submitted', 'confirmed', 'failed'],
    default: 'pending',
  })
  status: ClaimStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
