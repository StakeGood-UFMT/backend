import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeeperService } from './keeper.service';
import { KeeperController } from './keeper.controller';
import { MarketEntity } from '../../database/entities/market.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MarketEntity]), AuthModule],
  controllers: [KeeperController],
  providers: [KeeperService],
  exports: [KeeperService],
})
export class KeeperModule {}
