import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NgoProposalsController } from './ngo-proposals.controller';
import { NgoProposalsService } from './ngo-proposals.service';
import { NgoProposalEntity } from '../../database/entities/ngo-proposal.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NgoProposalEntity, NgoEntity]),
    forwardRef(() => AdminModule),
    AuthModule,
  ],
  controllers: [NgoProposalsController],
  providers: [NgoProposalsService],
  exports: [NgoProposalsService],
})
export class NgoProposalsModule {}
