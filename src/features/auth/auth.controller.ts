import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { KycWebhookDto } from './dto/kyc-webhook.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  getNonce(@Query('wallet') wallet: string) {
    return this.authService.generateNonce(wallet);
  }

  @Post('verify')
  verify(@Body() dto: VerifyAuthDto) {
    return this.authService.verifySignature(dto);
  }

  @Post('kyc/webhook')
  kycWebhook(@Body() dto: KycWebhookDto) {
    return this.authService.processKycWebhook(dto);
  }
}
