import { AuthService } from './auth.service';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { KycWebhookDto } from './dto/kyc-webhook.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getNonce(wallet: string): Promise<{
        nonce: string;
        expires_at: string;
        ttl_seconds: number;
    }>;
    verify(dto: VerifyAuthDto): Promise<{
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
    kycWebhook(dto: KycWebhookDto): Promise<{
        status: string;
    }>;
}
