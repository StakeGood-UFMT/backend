import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailsEntity } from '../../database/entities/user-details.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { KycProfileEntity } from '../../database/entities/kyc-profile.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDetailsEntity,
      UserPositionEntity,
      MarketEntity,
      KycProfileEntity,
      NgoEntity,
    ]),
    AuthModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
