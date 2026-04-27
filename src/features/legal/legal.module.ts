import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalController } from './legal.controller';
import { LegalService } from './legal.service';
import { TermsEntity } from '../../database/entities/terms.entity';
import { FaqEntity } from '../../database/entities/faq.entity';
import { UserDetailsEntity } from '../../database/entities/user-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TermsEntity, FaqEntity, UserDetailsEntity]),
  ],
  controllers: [LegalController],
  providers: [LegalService],
  exports: [LegalService],
})
export class LegalModule {}
