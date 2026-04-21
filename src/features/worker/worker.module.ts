import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StellarWorkerService } from './stellar-worker.service';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPositionEntity, MarketSnapshotEntity, DepositEntity]),
    WebsocketModule,
  ],
  providers: [StellarWorkerService],
  exports: [StellarWorkerService],
})
export class WorkerModule {}
