import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { v4 as uuidv4 } from 'uuid';

interface LedgerOptions {
  from?: string;
  to?: string;
  ngoId?: string;
  limit: number;
  offset: number;
}

@Injectable()
export class ImpactService {
  constructor(
    @InjectRepository(ImpactLedgerEntryEntity)
    private readonly ledgerRepo: Repository<ImpactLedgerEntryEntity>,
  ) {}

  async getLedger(options: LedgerOptions) {
    const query = this.ledgerRepo.createQueryBuilder('e').orderBy('e.date', 'DESC');

    if (options.from) query.andWhere('e.date >= :from', { from: new Date(options.from) });
    if (options.to) query.andWhere('e.date <= :to', { to: new Date(options.to) });
    if (options.ngoId) query.andWhere('e.ngo_id = :ngoId', { ngoId: options.ngoId });

    query.skip(options.offset).take(options.limit);
    const [entries, total] = await query.getManyAndCount();

    const totalDistributed = entries.reduce((sum, e) => sum + parseFloat(e.amount as any), 0);

    return {
      ledger_entries: entries,
      pagination: { total, limit: options.limit, offset: options.offset, has_next: options.offset + options.limit < total },
      summary: {
        period: { from: options.from, to: options.to },
        total_distributed: totalDistributed.toFixed(2),
        transaction_count: total,
      },
    };
  }

  async exportLedger(body: { format: string; from: string; to: string }) {
    const jobId = `job_${uuidv4().replace(/-/g, '').slice(0, 9)}`;
    const estimatedReadyAt = new Date(Date.now() + 2 * 60 * 1000);

    // TODO: Queue async export job (Bull/BullMQ)
    return {
      job_id: jobId,
      status: 'queued',
      format: body.format,
      estimated_ready_at: estimatedReadyAt.toISOString(),
      download_url: null,
      check_status_url: `/api/v1/impact/ledger/export/${jobId}`,
    };
  }
}
