export type PositionOutcome = 'YES' | 'NO';
export type PositionStatus = 'pending' | 'confirmed' | 'cancelled' | 'resolved' | 'claimed';
export declare class UserPositionEntity {
    id: string;
    userId: string;
    marketId: string;
    outcome: PositionOutcome;
    amountStaked: number;
    status: PositionStatus;
    txHash?: string;
    resolvedAt?: Date;
    payoutAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}
