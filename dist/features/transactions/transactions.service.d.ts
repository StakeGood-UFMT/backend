import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { BuildPredictionDto } from './dto/build-prediction.dto';
export declare class TransactionsService {
    private readonly userRepo;
    private readonly marketRepo;
    private readonly snapshotRepo;
    private readonly depositRepo;
    constructor(userRepo: Repository<UserEntity>, marketRepo: Repository<MarketEntity>, snapshotRepo: Repository<MarketSnapshotEntity>, depositRepo: Repository<DepositEntity>);
    buildPrediction(dto: BuildPredictionDto, jwtUser: any): Promise<{
        xdr: string;
        summary: {
            action: string;
            market: {
                id: string;
                title: string;
            };
            outcome: "YES" | "NO";
            amount: string;
            implied_probability: string;
            implied_odds: string;
            potential_win: string;
        };
    }>;
    private checkSpendingLimit;
}
