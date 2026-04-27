import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMarketDto } from './dto/create-market.dto';

@Controller('admin/markets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createMarket(@Body() dto: CreateMarketDto, @Request() req: any) {
    return this.adminService.createMarket(dto, req.user);
  }

  @Post(':id/resolve')
  async resolveMarket(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('outcome') outcome: 'YES' | 'NO',
    @Request() req: any,
  ) {
    return this.adminService.resolveMarket(id, outcome, req.user);
  }

  @Post(':id/cancel')
  async cancelMarket(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.adminService.cancelMarket(id, req.user);
  }

  @Post(':id/distribute-impact')
  async distributeImpact(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.adminService.distributeImpact(id, req.user);
  }
}
