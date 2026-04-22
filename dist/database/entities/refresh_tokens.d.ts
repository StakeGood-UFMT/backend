import { UserEntity } from './user.entity';
export declare class RefreshTokenEntity {
    id: string;
    user: UserEntity;
    token: string;
    expiresAt: Date;
    revoked: boolean;
}
