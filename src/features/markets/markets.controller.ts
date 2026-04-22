import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MarketsService } from './markets.service';
import { ListMarketsQueryDto } from './dto/list-markets-query.dto';

@Controller('markets')
@UseGuards(AuthGuard('jwt'))
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  findAll(@Query() query: ListMarketsQueryDto) {
    return this.marketsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketsService.findOne(id);
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
