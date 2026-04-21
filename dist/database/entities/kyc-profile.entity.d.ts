export type KycProfileStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export declare class KycProfileEntity {
    id: string;
    userId: string;
    providerId: string;
    status: KycProfileStatus;
    verifiedAt?: Date;
    amlFlags: Record<string, any>;
    rawData?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
