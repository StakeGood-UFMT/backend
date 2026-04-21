export type MarketStatus = 'draft' | 'active' | 'locked' | 'resolved';
export type MarketOutcome = 'YES' | 'NO';
export declare class MarketEntity {
    id: string;
    title: string;
    description?: string;
    category?: string;
    status: MarketStatus;
    lockAt: Date;
    resolveAt: Date;
    outcome?: MarketOutcome;
    oracleRef?: string;
    assetCode?: string;
    assetIssuer?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
