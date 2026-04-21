import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NgosController } from './ngos.controller';
import { NgosService } from './ngos.service';
import { NgoEntity } from '../../database/entities/ngo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NgoEntity])],
  controllers: [NgosController],
  providers: [NgosService],
  exports: [NgosService],
})
export class NgosModule {}
