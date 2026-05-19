import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NgosService } from './ngos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateNgoDto } from './dto/create-ngo.dto';

@Controller('ngos')
export class NgosController {
  constructor(private readonly ngosService: NgosService) {}

  private mapNgo(ngo: any) {
    const social = ngo?.social ?? {};
    
    const balances = ngo?.balances ?? {};
    const balanceEntries = Object.entries(balances);
    let totalFormatted = '';

    if (balanceEntries.length > 0) {
      totalFormatted = balanceEntries
        .map(([currency, amount]) => `${Number(amount).toFixed(2)} ${currency}`)
        .join(' + ');
    } else {
      const total = Number(ngo?.totalFundsReceived ?? 0);
      totalFormatted = Number.isFinite(total) && total > 0
        ? `${total.toFixed(2)} USDC`
        : '0.00 USDC';
    }

    return {
      id: ngo.id,
      on_chain_id: ngo.onChainId ?? null,
      name: ngo.name,
      description: ngo.description ?? '',
      logo_url: social.logo_url ?? social.logoUrl ?? '',
      cover_url: social.cover_url ?? social.coverUrl ?? undefined,
      cause: ngo.category ?? 'OTHER',
      verified: !!ngo.verified,
      total_impact: totalFormatted,
      website_url: ngo.website ?? undefined,
      audit_url: social.audit_url ?? social.auditUrl ?? undefined,
      treasury_url: social.treasury_url ?? social.treasuryUrl ?? undefined,
      certification_url:
        social.certification_url ?? social.certificationUrl ?? undefined,
      created_at: ngo.createdAt,
    };
  }

  private mapTimelineEvent(e: any) {
    const amount = Number(e?.amount ?? 0);
    const currency = e?.currency ?? 'USDC';
    const impactValue = Number.isFinite(amount) ? `${amount} ${currency}` : `0 ${currency}`;

    return {
      id: e.id,
      ngo_id: e.ngoId,
      title: e.source === 'fee_pool' ? 'Impact distributed' : 'Impact event',
      description:
        e.marketId
          ? `Impact distribution for market ${e.marketId}`
          : 'Impact distribution recorded on-chain.',
      impact_value: impactValue,
      tx_hash: e.txHash ?? '',
      date: e.date,
    };
  }

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('verified') verified?: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Query('sort') sort = 'trending',
  ) {
    const resp = await this.ngosService.findAll({
      category,
      verified: verified !== undefined ? verified === 'true' : undefined,
      limit: +limit,
      offset: +offset,
      sort,
    });
    return {
      ...resp,
      ngos: (resp?.ngos ?? []).map((n: any) => this.mapNgo(n)),
    };
  }

  @Get(':idOrSlug')
  async getByIdOrSlug(@Param('idOrSlug') idOrSlug: string) {
    const ngo = await ((
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug,
      )
        ? this.ngosService.findOne(idOrSlug)
        : this.ngosService.findBySlug(idOrSlug)
    ) as any);

    return this.mapNgo(ngo);
  }

  @Get(':id/timeline')
  async getTimeline(@Param('id') id: string) {
    const events = await this.ngosService.getTimeline(id);
    return (events ?? []).map((e: any) => this.mapTimelineEvent(e));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() data: CreateNgoDto) {
    return this.ngosService.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: Partial<CreateNgoDto>) {
    return this.ngosService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.ngosService.remove(id);
  }
}
