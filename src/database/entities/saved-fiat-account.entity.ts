import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('saved_fiat_accounts')
export class SavedFiatAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  type: string; // 'SPEI' | 'PIX'

  @Column({ name: 'account_number', length: 100 })
  accountNumber: string; // CLABE or PIX key

  @Column({ name: 'bank_name', length: 100, nullable: true })
  bankName?: string;

  @Column({ name: 'account_holder_name', length: 100 })
  accountHolderName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
