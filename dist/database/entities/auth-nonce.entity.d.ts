export declare class AuthNonceEntity {
    id: string;
    walletAddress: string;
    nonce: string;
    expiresAt: Date;
    usedAt?: Date;
    createdAt: Date;
}
