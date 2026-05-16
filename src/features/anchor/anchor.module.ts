import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { SavedFiatAccountEntity } from '../../database/entities/saved-fiat-account.entity';
import { QuoteEntity } from '../../database/entities/quote.entity';
import { RampOrderEntity } from '../../database/entities/ramp-order.entity';
import { AnchorController } from './anchor.controller';
import { AnchorService } from './anchor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SavedFiatAccountEntity,
      QuoteEntity,
      RampOrderEntity,
    ]),
  ],
  controllers: [AnchorController],
  providers: [AnchorService],
  exports: [AnchorService],
})
export class AnchorModule {}
