import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LegalService } from './legal.service';

@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  /**
   * GET /api/v1/legal/terms
   * Returns the current active version of Terms of Use.
   */
  @Get('terms')
  getCurrentTerms() {
    return this.legalService.getCurrentTerms();
  }

  /**
   * GET /api/v1/legal/faq
   * Returns active FAQ items for the Help Center.
   */
  @Get('faq')
  getFaqItems() {
    return this.legalService.getFaqItems();
  }

  /**
   * POST /api/v1/legal/terms/accept
   * Register that the user has accepted a specific version of terms.
   */
  @Post('terms/accept')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  acceptTerms(@Request() req: any, @Body('version') version: string) {
    return this.legalService.acceptTerms(req.user.userId, version);
  }
}
