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
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';
import {
  UpdatePrivacyDto,
  UpdateSpendingLimitsDto,
  LinkWalletChallengeDto,
  LinkWalletVerifyDto,
} from './dto/settings.dto';

@Controller('settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * GET /api/v1/settings
   * Returns the full settings snapshot for the authenticated user.
   */
  @Get()
  getSettings(@Request() req: any) {
    return this.settingsService.getSettings(req.user.userId);
  }

  /**
   * PATCH /api/v1/settings/privacy
   * Toggle public_visibility and private_mode.
   * Changes are reflected immediately on the leaderboard.
   */
  @Patch('privacy')
  updatePrivacy(@Request() req: any, @Body() dto: UpdatePrivacyDto) {
    return this.settingsService.updatePrivacy(req.user.userId, dto);
  }

  /**
   * PATCH /api/v1/settings/spending
   * Update self-imposed spending limits.
   */
  @Patch('spending')
  updateSpending(@Request() req: any, @Body() dto: UpdateSpendingLimitsDto) {
    return this.settingsService.updateSpendingLimits(req.user.userId, dto);
  }

  /**
   * GET /api/v1/settings/wallets
   * List all wallets (primary + linked secondaries).
   */
  @Get('wallets')
  async getWallets(@Request() req: any) {
    const settings = await this.settingsService.getSettings(req.user.userId);
    return settings.wallets;
  }

  /**
   * POST /api/v1/settings/wallets/challenge
   * Issue a signing nonce for linking a secondary Stellar wallet.
   * Body: { address: string }
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
   * POST /api/v1/settings/wallets/verify
   * Verify the signed nonce and persist the linked wallet.
   * Body: { address, signature, nonce }
   */
  @Post('wallets/verify')
  @HttpCode(HttpStatus.OK)
  verifyWalletLink(@Request() req: any, @Body() dto: LinkWalletVerifyDto) {
    return this.settingsService.verifyWalletLink(req.user.userId, dto);
  }

  /**
   * DELETE /api/v1/settings/wallets/:address
   * Remove a previously linked secondary wallet.
   */
  @Delete('wallets/:address')
  unlinkWallet(@Request() req: any, @Param('address') address: string) {
    return this.settingsService.unlinkWallet(req.user.userId, address);
  }

  /**
   * GET /api/v1/settings/2fa
   * Returns the current 2FA status (enabled/disabled).
   */
  @Get('2fa')
  get2faStatus(@Request() req: any) {
    return this.settingsService.get2faStatus(req.user.userId);
  }
}
