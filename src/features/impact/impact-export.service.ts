import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { stringify } from 'csv-stringify/sync';
import * as fs from 'fs';
import * as path from 'path';

export interface ExportOptions {
  format: 'csv' | 'pdf';
  from: string;
  to: string;
  ngoId?: string;
  jobId: string;
}

@Injectable()
export class ImpactExportService {
  constructor(
    @InjectRepository(ImpactLedgerEntryEntity)
    private readonly ledgerRepo: Repository<ImpactLedgerEntryEntity>,
  ) {}

  async generateExport(options: ExportOptions) {
    const { format, from, to, ngoId, jobId } = options;

    const query = this.ledgerRepo.createQueryBuilder('e').orderBy('e.date', 'DESC');

    if (from) query.andWhere('e.date >= :from', { from: new Date(from) });
    if (to) query.andWhere('e.date <= :to', { to: new Date(to) });
    if (ngoId) query.andWhere('e.ngo_id = :ngoId', { ngoId });

    const entries = await query.getMany();

    let fileContent: string | Buffer;
    let fileName: string;

    if (format === 'csv') {
      const data = entries.map((e) => ({
        ID: e.id,
        Date: e.date.toISOString(),
        Amount: e.amount,
        Currency: e.currency,
        Source: e.source,
        'NGO ID': e.ngoId,
        'Market ID': e.marketId || 'N/A',
        'TX Hash': e.txHash || 'N/A',
      }));

      fileContent = stringify(data, { header: true });
      fileName = `${jobId}.csv`;
    } else {
      fileContent = `PDF Export for ${jobId}\n\n` + JSON.stringify(entries, null, 2);
      fileName = `${jobId}.pdf`;
    }

    const exportDir = path.join(process.cwd(), 'public', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = path.join(exportDir, fileName);
    fs.writeFileSync(filePath, fileContent);

    return {
      downloadUrl: `/public/exports/${fileName}`,
      count: entries.length,
    };
  }
}
