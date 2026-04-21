export type UserRole = 'user' | 'moderator' | 'admin';
export type KycStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type KycTier = 'individual' | 'business';
export declare class UserEntity {
    id: string;
    primaryWallet: string;
    role: UserRole;
    kycStatus: KycStatus;
    kycTier: KycTier;
    publicVisibility: boolean;
    privateMode: boolean;
    spendingLimitUsd: number;
    spendingWindowDays: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
