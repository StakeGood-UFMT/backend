import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { ImpactExportService, ExportOptions } from './impact-export.service';
import { ConfigService } from '@nestjs/config';

interface LedgerOptions {
  from?: string;
  to?: string;
  ngoId?: string;
  limit: number;
  offset: number;
}

interface ExportJobResult {
  downloadUrl: string;
  count: number;
}

@Injectable()
export class ImpactService {
  private readonly redisEnabled: boolean;

  constructor(
    @InjectRepository(ImpactLedgerEntryEntity)
    private readonly ledgerRepo: Repository<ImpactLedgerEntryEntity>,
    @InjectQueue('impact_export')
    private readonly exportQueue: Queue<ExportOptions, ExportJobResult>,
    private readonly exportService: ImpactExportService,
    private readonly configService: ConfigService,
  ) {
    this.redisEnabled =
      this.configService.get('ENABLE_REDIS', 'false') === 'true';
  }

  async getLedger(options: LedgerOptions) {
    const query = this.ledgerRepo
      .createQueryBuilder('e')
      .orderBy('e.date', 'DESC');

    if (options.from)
      query.andWhere('e.date >= :from', { from: new Date(options.from) });
    if (options.to)
      query.andWhere('e.date <= :to', { to: new Date(options.to) });
    if (options.ngoId)
      query.andWhere('e.ngo_id = :ngoId', { ngoId: options.ngoId });

    query.skip(options.offset).take(options.limit);
    const [entries, total] = await query.getManyAndCount();

    const totalDistributed = entries.reduce(
      (sum, e) => sum + Number(e.amount),
      0,
    );

    return {
      ledger_entries: entries,
      pagination: {
        total,
        limit: options.limit,
        offset: options.offset,
        has_next: options.offset + options.limit < total,
      },
      summary: {
        period: { from: options.from, to: options.to },
        total_distributed: totalDistributed.toFixed(2),
        transaction_count: total,
      },
    };
  }

  async exportLedger(body: {
    format: 'csv' | 'pdf';
    from: string;
    to: string;
    ngo_id?: string;
  }) {
    const jobId = `job_${uuidv4().replace(/-/g, '').slice(0, 9)}`;
    const exportOptions: ExportOptions = {
      ...body,
      jobId,
      ngoId: body.ngo_id,
    };

    if (this.redisEnabled) {
      await this.exportQueue.add('generate_export', exportOptions, {
        jobId,
        removeOnComplete: true,
      });

      return {
        job_id: jobId,
        status: 'queued',
        format: body.format,
        check_status_url: `/api/v1/impact/ledger/export/${jobId}`,
      };
    } else {
      // Execução síncrona sem Redis
      const result = await this.exportService.generateExport(exportOptions);
      return {
        job_id: jobId,
        status: 'completed',
        format: body.format,
        download_url: result.downloadUrl,
        check_status_url: `/api/v1/impact/ledger/export/${jobId}`,
      };
    }
  }

  async getExportStatus(jobId: string) {
    if (!this.redisEnabled) {
      // Se Redis está desativado, assumimos que se o arquivo existe, está pronto.
      // Como não guardamos estado sem Redis, retornamos 'unknown_or_completed'
      // ou verificamos se o arquivo físico existe se necessário.
      return { job_id: jobId, status: 'completed_or_sync' };
    }

    const job = await this.exportQueue.getJob(jobId);

    if (!job) {
      return { job_id: jobId, status: 'unknown_or_completed' };
    }

    const state = await job.getState();
    const result = job.returnvalue;

    return {
      job_id: jobId,
      status: state,
      progress: job.progress,
      download_url: result?.downloadUrl || null,
      error: job.failedReason || null,
    };
  }
}
