import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Request,
  Query,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ModerateProposalDto } from './dto/moderate-proposal.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProposalStatus } from '../../database/entities/proposal.entity';

@Controller('proposals')
@UseGuards(AuthGuard('jwt'))
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  async create(@Body() dto: CreateProposalDto, @Request() req: any) {
    return this.proposalService.create(dto, req.user.userId);
  }

  @Get()
  async findAll(@Query('status') status?: ProposalStatus) {
    return this.proposalService.findAll(status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.proposalService.findOne(id);
  }

  @Patch(':id/moderate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async moderate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ModerateProposalDto,
    @Request() req: any,
  ) {
    return this.proposalService.moderate(id, dto, req.user);
  }
}
