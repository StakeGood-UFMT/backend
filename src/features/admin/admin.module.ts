import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminAdminsController } from './admin-admins.controller';
import { AdminService } from './admin.service';
import { MarketEntity } from '../../database/entities/market.entity';
import { AuditLogEntity } from '../../database/entities/audit-log.entity';
import { TxIntentEntity } from '../../database/entities/tx-intent.entity';
import { TxReceiptEntity } from '../../database/entities/tx-receipt.entity';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketEntity,
      AuditLogEntity,
      TxIntentEntity,
      TxReceiptEntity,
      ImpactLedgerEntryEntity,
      UserEntity,
    ]),
    AuthModule,
  ],
  controllers: [AdminController, AdminAdminsController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
