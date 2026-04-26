import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('portfolio')
  getPortfolio(@Request() req: any, @Query() query: PaginationQueryDto) {
    return this.usersService.getPortfolio(req.user.userId, query);
  }

  @Get('history')
  getHistory(@Request() req: any, @Query() query: PaginationQueryDto) {
    return this.usersService.getHistory(req.user.userId, query);
  }

  @Get('claims')
  getClaims(@Request() req: any, @Query() query: PaginationQueryDto) {
    return this.usersService.getClaims(req.user.userId, query);
  }
}
