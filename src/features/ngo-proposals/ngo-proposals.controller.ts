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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { NgoProposalsService } from './ngo-proposals.service';
import { CreateNgoProposalDto } from './dto/create-ngo-proposal.dto';
import { ModerateNgoProposalDto } from './dto/moderate-ngo-proposal.dto';
import { NgoProposalStatus } from '../../database/entities/ngo-proposal.entity';

@Controller('ngo-proposals')
@UseGuards(AuthGuard('jwt'))
export class NgoProposalsController {
  constructor(private readonly service: NgoProposalsService) {}

  @Post()
  async create(@Body() dto: CreateNgoProposalDto, @Request() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll(@Query('status') status?: NgoProposalStatus) {
    return this.service.findAll(status);
  }

  @Get('mine')
  async findMine(@Request() req: any, @Query('status') status?: NgoProposalStatus) {
    return this.service.findMine(req.user.userId, status);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/build-approval')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async buildApproval(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.service.buildApprovalXdr(id, req.user);
  }

  @Patch(':id/moderate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async moderate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ModerateNgoProposalDto,
    @Request() req: any,
  ) {
    return this.service.moderate(id, dto, req.user);
  }
}
