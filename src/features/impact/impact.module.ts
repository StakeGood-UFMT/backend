import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImpactController } from './impact.controller';
import { ImpactService } from './impact.service';
import { ExportProcessor } from './export.processor';
import { ImpactExportService } from './impact-export.service';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule, getQueueToken } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImpactLedgerEntryEntity, NgoEntity]),
    ConfigModule,
    ...(process.env.ENABLE_REDIS === 'true'
      ? [
          BullModule.registerQueue({
            name: 'impact_export',
          }),
        ]
      : []),
  ],
  controllers: [ImpactController],
  providers: [
    ImpactService,
    ImpactExportService,
    ...(process.env.ENABLE_REDIS === 'true'
      ? [ExportProcessor]
      : [
          {
            provide: getQueueToken('impact_export'),
            useValue: { add: () => null, getJob: () => null }, // Mock Queue
          },
        ]),
  ],
})
export class ImpactModule {}
