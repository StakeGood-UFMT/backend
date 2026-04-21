import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImpactController } from './impact.controller';
import { ImpactService } from './impact.service';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImpactLedgerEntryEntity, NgoEntity])],
  controllers: [ImpactController],
  providers: [ImpactService],
})
export class ImpactModule {}
