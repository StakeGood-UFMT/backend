import { Repository } from 'typeorm';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
interface LedgerOptions {
    from?: string;
    to?: string;
    ngoId?: string;
    limit: number;
    offset: number;
}
export declare class ImpactService {
    private readonly ledgerRepo;
    constructor(ledgerRepo: Repository<ImpactLedgerEntryEntity>);
    getLedger(options: LedgerOptions): Promise<{
        ledger_entries: ImpactLedgerEntryEntity[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            has_next: boolean;
        };
        summary: {
            period: {
                from: string | undefined;
                to: string | undefined;
            };
            total_distributed: string;
            transaction_count: number;
        };
    }>;
    exportLedger(body: {
        format: string;
        from: string;
        to: string;
    }): Promise<{
        job_id: string;
        status: string;
        format: string;
        estimated_ready_at: string;
        download_url: null;
        check_status_url: string;
    }>;
}
export {};
