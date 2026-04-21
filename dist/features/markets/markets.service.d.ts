import { Repository } from 'typeorm';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
interface FindAllOptions {
    status?: string;
    category?: string;
    limit: number;
    offset: number;
    sort: string;
}
export declare class MarketsService {
    private readonly marketRepo;
    private readonly snapshotRepo;
    constructor(marketRepo: Repository<MarketEntity>, snapshotRepo: Repository<MarketSnapshotEntity>);
    findAll(options: FindAllOptions): Promise<{
        markets: MarketEntity[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            has_next: boolean;
        };
    }>;
    getHistory(marketId: string, _interval: string, days: number): Promise<{
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
export {};
