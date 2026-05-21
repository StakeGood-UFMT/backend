import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { ProposalEntity } from '../../database/entities/proposal.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProposalEntity, MarketEntity, NgoEntity]),
    forwardRef(() => AdminModule),
    AuthModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalService],
  exports: [ProposalService],
})
export class ProposalModule {}
