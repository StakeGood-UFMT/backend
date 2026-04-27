import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailsEntity } from '../../database/entities/user-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDetailsEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
