import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { ListMarketsQueryDto } from './dto/list-markets-query.dto';

@Controller('markets')
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
    @Query('days') days?: string,
    @Query('range') range?: string,
  ) {
    let daysNum = days ? +days : 7;

    if (range) {
      if (range === '1D') daysNum = 1;
      else if (range === '1W') daysNum = 7;
      else if (range === 'ALL') daysNum = 365; // Arbitrary large number for ALL
    }

    return this.marketsService.getHistory(id, interval, daysNum);
  }
}
