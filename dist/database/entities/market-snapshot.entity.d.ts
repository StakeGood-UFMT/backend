export declare class MarketSnapshotEntity {
    id: string;
    marketId: string;
    timestamp: Date;
    yesPool: number;
    noPool: number;
    tradingVolume?: number;
    createdAt: Date;
    get impliedProbYes(): number;
}
