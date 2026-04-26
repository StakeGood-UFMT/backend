import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { TxReceiptEntity } from '../../database/entities/tx-receipt.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserPositionEntity, MarketEntity, TxReceiptEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
