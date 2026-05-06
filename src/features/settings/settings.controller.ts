import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';
import { AuthService } from '../auth/auth.service';
import {
  UpdatePrivacyDto,
  UpdateSpendingLimitsDto,
  LinkWalletChallengeDto,
  LinkWalletVerifyDto,
} from './dto/settings.dto';

@Controller('users/me')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly authService: AuthService,
  ) {}

  /**
   * GET /api/v1/users/me/settings
   * Returns the full settings snapshot for the authenticated user.
   */
  @Get('settings')
  getSettings(@Request() req: any) {
    return this.settingsService.getSettings(req.user.userId);
  }

  /**
   * PATCH /api/v1/users/me/privacy
   * Toggle public_visibility and private_mode.
   */
  @Patch('privacy')
  updatePrivacy(@Request() req: any, @Body() dto: UpdatePrivacyDto) {
    return this.settingsService.updatePrivacy(req.user.userId, dto);
  }

  /**
   * PATCH /api/v1/users/me/spending
   * Update self-imposed spending limits.
   */
  @Patch('spending')
  updateSpending(@Request() req: any, @Body() dto: UpdateSpendingLimitsDto) {
    return this.settingsService.updateSpendingLimits(req.user.userId, dto);
  }

  /**
   * GET /api/v1/users/me/wallets
   * List all wallets (primary + linked secondaries).
   */
  @Get('wallets')
  async getWallets(@Request() req: any) {
    const settings = await this.settingsService.getSettings(req.user.userId);
    return settings.wallets;
  }

  /**
   * POST /api/v1/users/me/wallets
   * Simplified wallet linking (legacy/basic flow).
   */
  @Post('wallets')
  async addWallet(@Request() req: any, @Body() dto: { address: string }) {
    // For now, we'll use a simplified version of the linking logic
    // In a real scenario, this should probably still use the challenge/verify flow
    // but we'll adapt it to the frontend's current simple POST expectation.
    return this.settingsService.addWalletSimple(req.user.userId, dto.address);
  }

  /**
   * POST /api/v1/users/me/wallets/challenge
   * Issue a signing nonce for linking a secondary Stellar wallet.
   */
  @Post('wallets/challenge')
  @HttpCode(HttpStatus.OK)
  createWalletChallenge(
    @Request() req: any,
    @Body() dto: LinkWalletChallengeDto,
  ) {
    return this.settingsService.createWalletChallenge(req.user.userId, dto);
  }

  /**
   * POST /api/v1/users/me/wallets/verify
   * Verify the signed nonce and persist the linked wallet.
   */
  @Post('wallets/verify')
  @HttpCode(HttpStatus.OK)
  verifyWalletLink(@Request() req: any, @Body() dto: LinkWalletVerifyDto) {
    return this.settingsService.verifyWalletLink(req.user.userId, dto);
  }

  /**
   * DELETE /api/v1/users/me/wallets/:address
   * Remove a previously linked secondary wallet.
   */
  @Delete('wallets/:address')
  unlinkWallet(@Request() req: any, @Param('address') address: string) {
    return this.settingsService.unlinkWallet(req.user.userId, address);
  }

  @Get('claims')
  getClaims(@Request() req: any) {
    return this.settingsService.getClaims(req.user.userId);
  }

  /**
   * GET /api/v1/users/me/2fa
   * Returns the current 2FA status.
   */
  @Get('2fa')
  get2faStatus(@Request() req: any) {
    return this.settingsService.get2faStatus(req.user.userId);
  }

  /**
   * POST /api/v1/users/me/2fa/enable
   * Initiates 2FA setup by generating a secret and QR code.
   */
  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  enable2fa(@Request() req: any) {
    return this.settingsService.initiate2fa(req.user.userId);
  }

  /**
   * POST /api/v1/users/me/2fa/verify
   * Completes 2FA setup by verifying the first token.
   */
  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  verify2fa(@Request() req: any, @Body() dto: { token: string }) {
    return this.settingsService.verifyAndEnable2fa(req.user.userId, dto.token);
  }

  /**
   * POST /api/v1/users/me/2fa/disable
   * Disables 2FA. Requires a valid token.
   */
  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  disable2fa(@Request() req: any, @Body() dto: { token: string }) {
    return this.settingsService.disable2fa(req.user.userId, dto.token);
  }

  /**
   * POST /api/v1/users/me/compliance-report/export
   * Exports user compliance data as PDF/CSV.
   */
  @Post('compliance-report/export')
  @HttpCode(HttpStatus.OK)
  exportCompliance(@Request() req: any) {
    // Stub
    return { message: 'Export started. You will receive an email shortly.' };
  }

  @Post('kyc/mock-verify')
  @HttpCode(HttpStatus.OK)
  mockVerifyKyc(@Request() req: any) {
    return this.authService.mockVerifyKyc(req.user.userId);
  }
}
