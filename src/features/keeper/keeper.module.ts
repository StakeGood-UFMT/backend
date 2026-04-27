import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeeperService } from './keeper.service';
import { MarketEntity } from '../../database/entities/market.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketEntity])],
  providers: [KeeperService],
  exports: [KeeperService],
})
export class KeeperModule {}
