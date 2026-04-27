import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NgosController } from './ngos.controller';
import { NgosService } from './ngos.service';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NgoEntity, ImpactLedgerEntryEntity])],
  controllers: [NgosController],
  providers: [NgosService],
  exports: [NgosService],
})
export class NgosModule {}
