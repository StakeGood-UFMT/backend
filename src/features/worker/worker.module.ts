import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StellarWorkerService } from './stellar-worker.service';
import { ProcessedTransactionEntity } from '../../database/entities/processed-transaction.entity';
import { WorkerCursorEntity } from '../../database/entities/worker-cursor.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { MarketEntity } from '../../database/entities/market.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcessedTransactionEntity,
      WorkerCursorEntity,
      NgoEntity,
      MarketEntity,
    ]),
  ],
  providers: [StellarWorkerService],
  exports: [StellarWorkerService],
})
export class WorkerModule {}
