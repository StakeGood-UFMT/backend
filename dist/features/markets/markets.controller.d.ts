import { MarketsService } from './markets.service';
export declare class MarketsController {
    private readonly marketsService;
    constructor(marketsService: MarketsService);
    findAll(status?: string, category?: string, limit?: number, offset?: number, sort?: string): Promise<{
        markets: import("../../database/entities/market.entity").MarketEntity[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            has_next: boolean;
        };
    }>;
    getHistory(id: string, interval?: string, days?: number): Promise<{
        market_id: string;
        title: string;
        snapshots: {
            timestamp: Date;
            yes_pool: number;
            no_pool: number;
            yes_probability: number;
            trading_volume: number | undefined;
        }[];
    }>;
}
