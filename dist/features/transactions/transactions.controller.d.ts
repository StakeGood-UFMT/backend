import { TransactionsService } from './transactions.service';
import { BuildPredictionDto } from './dto/build-prediction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    buildPrediction(dto: BuildPredictionDto, req: any): Promise<{
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
}
