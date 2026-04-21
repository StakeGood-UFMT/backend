import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImpactService } from './impact.service';

@Controller('impact')
export class ImpactController {
  constructor(private readonly impactService: ImpactService) {}

  @Get('ledger')
  getLedger(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('ngo_id') ngoId?: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    return this.impactService.getLedger({ from, to, ngoId, limit: +limit, offset: +offset });
  }

  @Post('ledger/export')
  @UseGuards(AuthGuard('jwt'))
  exportLedger(
    @Body() body: { format: 'csv' | 'pdf'; from: string; to: string; include_breakdown?: boolean },
  ) {
    return this.impactService.exportLedger(body);
  }
}
