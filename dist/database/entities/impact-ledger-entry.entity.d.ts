export type LedgerSource = 'quadratic_voting' | 'donation' | 'grant' | 'fee_pool';
export declare class ImpactLedgerEntryEntity {
    id: string;
    date: Date;
    marketId?: string;
    ngoId: string;
    amount: number;
    currency: string;
    source: LedgerSource;
    txHash?: string;
    breakdown?: Record<string, any>;
    createdAt: Date;
}
