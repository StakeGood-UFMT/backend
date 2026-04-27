import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { KeeperService } from './keeper.service';

@Controller('admin/keeper')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class KeeperController {
  private readonly logger = new Logger(KeeperController.name);

  constructor(private readonly keeperService: KeeperService) {}

  @Get('eligible-markets')
  async getEligibleMarkets() {
    this.logger.log('Recebida requisição para listar mercados elegíveis para keeper');
    return this.keeperService.getEligibleMarkets();
  }

  @Post('batch-bump-ttl')
  async batchBumpTTL(@Body('market_ids') marketIds: string[]) {
    this.logger.log(`Recebida requisição para batch bump TTL para ${marketIds?.length} mercados`);
    return this.keeperService.batchBumpTTL(marketIds);
  }
}
