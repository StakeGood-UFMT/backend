import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MarketsService } from './markets.service';

@Controller('markets')
@UseGuards(AuthGuard('jwt'))
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Query('sort') sort = 'newest',
  ) {
    return this.marketsService.findAll({ status, category, limit: +limit, offset: +offset, sort });
  }

  @Get(':id/history')
  getHistory(
    @Param('id') id: string,
    @Query('interval') interval = '1h',
    @Query('days') days = 7,
  ) {
    return this.marketsService.getHistory(id, interval, +days);
  }
}
