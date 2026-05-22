import express from 'express';
import { Controller, Get, Post, Body, Query, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
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
  getNonce(
    @Query('wallet') wallet: string,
    @Query('network') network?: string,
  ) {
    return this.authService.generateNonce(wallet, network);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
  res.clearCookie('jwt');
  res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
  return { message: 'Logged out' };
}

  @Post('verify')
  async verify(@Body() dto: VerifyAuthDto, @Res({ passthrough: true }) res: express.Response) {

    const result = await this.authService.verifySignature(dto);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('jwt', result.jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return {
      wallet: result.wallet,
      kyc_status: result.kyc_status,
      kyc_tier: result.kyc_tier,
      expires_in: result.expires_in,
      user: result.user,
    };
  }

  @UseGuards(HmacWebhookGuard)
  @Post('kyc/webhook')
  kycWebhook(@Body() dto: KycWebhookDto) {
    return this.authService.processKycWebhook(dto);
  }

  @Post('refresh')
  async refresh(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    // return this.authService.refreshToken(dto.refresh_token);
     const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) throw new UnauthorizedException('No refresh token');
  
  const result = await this.authService.refreshToken(refreshToken);
  
  // renova o access token cookie
  res.cookie('jwt', result.jwt, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return {
    wallet: result.wallet,
    kyc_status: result.kyc_status,
    kyc_tier: result.kyc_tier,
    expires_in: result.expires_in,
    user: result.user,
  };
  }
}
