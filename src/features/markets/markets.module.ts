import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketEntity,
      MarketSnapshotEntity,
      UserPositionEntity,
      UserEntity,
      NgoEntity,
    ]),
  ],
  controllers: [MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
