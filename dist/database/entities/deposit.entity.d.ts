export type DepositStatus = 'pending' | 'confirmed' | 'failed';
export declare class DepositEntity {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    txHash: string;
    status: DepositStatus;
    createdAt: Date;
    confirmedAt?: Date;
}
