import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { KycWebhookDto } from './dto/kyc-webhook.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { HmacWebhookGuard } from './guards/hmac-webhook.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Get('nonce')
  @Throttle({
    default: {
      ttl: 60000,
      limit: 5,
    },
  })
  getNonce(@Query('wallet') wallet: string) {
    return this.authService.generateNonce(wallet);
  }

  @Post('verify')
  verify(@Body() dto: VerifyAuthDto) {
    return this.authService.verifySignature(dto);
  }

  @UseGuards(HmacWebhookGuard)
  @Post('kyc/webhook')
  kycWebhook(@Body() dto: KycWebhookDto) {
    return this.authService.processKycWebhook(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshAuthDto) {
    return this.authService.refreshToken(dto.refresh_token);
  }
}
