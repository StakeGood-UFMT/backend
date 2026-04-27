import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('snapshots')
  async getSnapshots(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
  ) {
    const opts = { from, to, limit: limit ? Number(limit) : undefined };
    return this.leaderboardService.getSnapshots(opts);
  }
}
