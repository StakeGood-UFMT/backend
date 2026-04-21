export declare class NgoEntity {
    id: string;
    name: string;
    slug: string;
    description?: string;
    category?: string;
    verified: boolean;
    verificationDate?: Date;
    verifiedBy?: string;
    walletAddress: string;
    website?: string;
    social: Record<string, any>;
    impactMetrics: Record<string, any>;
    totalFundsReceived: number;
    createdAt: Date;
    updatedAt: Date;
}
