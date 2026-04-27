import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ImpactExportService, ExportOptions } from './impact-export.service';

interface ExportJobResult {
  downloadUrl: string;
  count: number;
}

@Processor('impact_export')
export class ExportProcessor extends WorkerHost {
  constructor(private readonly exportService: ImpactExportService) {
    super();
  }

  async process(job: Job<ExportOptions, ExportJobResult, string>): Promise<ExportJobResult> {
    return this.exportService.generateExport(job.data);
  }
}
