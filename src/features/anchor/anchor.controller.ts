import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnchorService } from './anchor.service';
import type { Request as ExpressRequest } from 'express';

@Controller('anchor')
@UseGuards(AuthGuard('jwt'))
export class AnchorController {
  constructor(private readonly anchorService: AnchorService) {}

  @Get('kyc/url')
  getKycUrl(
    @Request() req: ExpressRequest & { user?: { [key: string]: any } },
    @Query('currency') currency?: string,
  ) {
    return this.anchorService.getKycUrl(req.user?.userId, currency);
  }

  @Get('kyc/status')
  getKycStatus(@Request() req: ExpressRequest & { user?: { [key: string]: any } }) {
    return this.anchorService.getKycStatus(req.user?.userId);
  }

  @Post('quotes')
  createQuote(
    @Body() body: { fromCurrency: string; toCurrency: string; amount: string },
    @Request() req: ExpressRequest & { user?: { [key: string]: any } },
  ) {
    return this.anchorService.createQuote(req.user?.userId, body);
  }

  @Post('onramp')
  createOnRamp(
    @Body() body: { quoteId: string; amount: string; fromCurrency: string; toCurrency: string },
    @Request() req: ExpressRequest & { user?: { [key: string]: any } },
  ) {
    return this.anchorService.createOnRamp(req.user?.userId, body);
  }

  @Post('offramp')
  createOffRamp(
    @Body() body: { quoteId: string; amount: string; fromCurrency: string; toCurrency: string; fiatAccountId: string },
    @Request() req: ExpressRequest & { user?: { [key: string]: any } },
  ) {
    return this.anchorService.createOffRamp(req.user?.userId, body);
  }

  @Get('orders')
  getUserOrders(@Request() req: ExpressRequest & { user?: { [key: string]: any } }) {
    return this.anchorService.getUserOrders(req.user?.userId);
  }

  @Get('orders/:id')
  getOrderStatus(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user?: { [key: string]: any } },
  ) {
    return this.anchorService.getOrderStatus(req.user?.userId, id);
  }

  @Get('accounts')
  getFiatAccounts(@Request() req: ExpressRequest & { user?: { [key: string]: any } }) {
    return this.anchorService.getFiatAccounts(req.user?.userId);
  }

  @Post('sandbox/simulate-payment')
  simulatePayment(@Body() body: { orderId: string }) {
    return this.anchorService.simulatePayment(body.orderId);
  }

  @Post('sandbox/auto-approve-kyc')
  sandboxAutoApproveKyc(@Request() req: ExpressRequest & { user?: { [key: string]: any } }) {
    return this.anchorService.sandboxAutoApproveKyc(req.user?.userId);
  }

  @Post('trustline')
  createTrustline(
    @Body() body: { assetCode: string; assetIssuer: string },
    @Request() req: ExpressRequest & { user?: { [key: string]: any } },
  ) {
    return this.anchorService.createTrustline(req.user?.userId, body);
  }
}
