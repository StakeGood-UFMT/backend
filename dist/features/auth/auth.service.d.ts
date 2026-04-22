import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthNonceEntity } from '../../database/entities/auth-nonce.entity';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { KycWebhookDto } from './dto/kyc-webhook.dto';
import { RefreshTokenEntity } from '../../database/entities/refresh_tokens';
export declare class AuthService {
    private readonly userRepo;
    private readonly nonceRepo;
    private readonly jwtService;
    private readonly refreshRepo;
    constructor(userRepo: Repository<UserEntity>, nonceRepo: Repository<AuthNonceEntity>, jwtService: JwtService, refreshRepo: Repository<RefreshTokenEntity>);
    generateNonce(wallet: string): Promise<{
        nonce: string;
        expires_at: string;
        ttl_seconds: number;
    }>;
    verifySignature(dto: VerifyAuthDto): Promise<{
        refresh_token: string;
        jwt: string;
        wallet: string;
        kyc_status: import("../../database/entities/user.entity").KycStatus;
        kyc_tier: import("../../database/entities/user.entity").KycTier;
        expires_in: string;
        user: {
            id: string;
            primary_wallet: string;
            role: import("../../database/entities/user.entity").UserRole;
            public_visibility: boolean;
        };
    }>;
    processKycWebhook(dto: KycWebhookDto): Promise<{
        status: string;
    }>;
}
