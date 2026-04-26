import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { ClaimEntity } from '../../database/entities/claim.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { VoteEntity } from '../../database/entities/vote.entity';
import { TxIntentEntity } from '../../database/entities/tx-intent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity, MarketEntity, MarketSnapshotEntity, DepositEntity,
    UserPositionEntity, ClaimEntity, NgoEntity, VoteEntity, TxIntentEntity,
  ])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
