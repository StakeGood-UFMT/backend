import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/admins')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminAdminsController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAdmins() {
    return this.adminService.getAdmins();
  }

  @Post('build-add')
  async buildAddAdmin(
    @Body('wallet') wallet: string,
    @Request() req: any,
  ) {
    if (!wallet) {
      throw new BadRequestException('Wallet address is required');
    }
    return this.adminService.buildAddAdminXdr({
      adminWallet: req.user.wallet,
      newAdminWallet: wallet,
    });
  }

  @Post('build-remove')
  async buildRemoveAdmin(
    @Body('wallet') wallet: string,
    @Request() req: any,
  ) {
    if (!wallet) {
      throw new BadRequestException('Wallet address is required');
    }
    return this.adminService.buildRemoveAdminXdr({
      adminWallet: req.user.wallet,
      adminToRemoveWallet: wallet,
    });
  }
}
