import {
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Index()
    @Column({ type: 'varchar' })
    token: string;

    @Column({ name: 'expires_at' })
    expiresAt: Date;

    @Column({ default: false }) 
    revoked: boolean;
}