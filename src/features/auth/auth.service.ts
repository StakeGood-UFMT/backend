import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthNonceEntity } from '../../database/entities/auth-nonce.entity';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { KycWebhookDto } from './dto/kyc-webhook.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(AuthNonceEntity)
    private readonly nonceRepo: Repository<AuthNonceEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async generateNonce(wallet: string) {
    if (!wallet || wallet.length !== 56 || !wallet.startsWith('G')) {
      throw new BadRequestException('Invalid Stellar wallet address');
    }

    const nonce = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.nonceRepo.save({ walletAddress: wallet, nonce, expiresAt });

    return { nonce, expires_at: expiresAt.toISOString(), ttl_seconds: 300 };
  }

  async verifySignature(dto: VerifyAuthDto) {
    const { wallet, nonce, signature: _signature } = dto;

    const nonceRecord = await this.nonceRepo.findOne({
      where: { walletAddress: wallet, nonce },
    });

    if (!nonceRecord || nonceRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired nonce');
    }

    if (nonceRecord.usedAt) {
      throw new BadRequestException('Nonce already used');
    }

    // TODO: Validate Ed25519 signature via tweetnacl/stellar-sdk
    // nacl.sign.open(signatureBuffer, publicKeyBuffer)

    await this.nonceRepo.update(nonceRecord.id, { usedAt: new Date() });

    let user = await this.userRepo.findOne({ where: { primaryWallet: wallet } });
    if (!user) {
      user = await this.userRepo.save({ primaryWallet: wallet });
    }

    const token = this.jwtService.sign({
      sub: wallet,
      userId: user.id,
      kyc_status: user.kycStatus,
      kyc_tier: user.kycTier,
      role: user.role,
    });

    return {
      jwt: token,
      wallet,
      kyc_status: user.kycStatus,
      kyc_tier: user.kycTier,
      expires_in: 86400,
      user: {
        id: user.id,
        primary_wallet: user.primaryWallet,
        role: user.role,
        public_visibility: user.publicVisibility,
      },
    };
  }

  async processKycWebhook(dto: KycWebhookDto) {
    const user = await this.userRepo.findOne({
      where: { id: dto.externalUserId },
    });

    if (!user) return { status: 'ignored' };

    const status = dto.review.reviewStatus === 'approved' ? 'verified' : 'rejected';
    await this.userRepo.update(user.id, { kycStatus: status as any });

    return { status: 'processed' };
  }
}
