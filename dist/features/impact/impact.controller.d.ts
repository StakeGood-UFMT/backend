import { ImpactService } from './impact.service';
export declare class ImpactController {
    private readonly impactService;
    constructor(impactService: ImpactService);
    getLedger(from?: string, to?: string, ngoId?: string, limit?: number, offset?: number): Promise<{
        ledger_entries: import("../../database/entities/impact-ledger-entry.entity").ImpactLedgerEntryEntity[];
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
        format: 'csv' | 'pdf';
        from: string;
        to: string;
        include_breakdown?: boolean;
    }): Promise<{
        job_id: string;
        status: string;
        format: string;
        estimated_ready_at: string;
        download_url: null;
        check_status_url: string;
    }>;
}
