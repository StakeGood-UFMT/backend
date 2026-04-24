import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthNonceEntity } from '../../database/entities/auth-nonce.entity';
import { KycProfileEntity } from '../../database/entities/kyc-profile.entity';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { KycWebhookDto } from './dto/kyc-webhook.dto';
import { Keypair } from '@stellar/stellar-sdk';
import { RefreshTokenEntity } from '../../database/entities/refresh_tokens';
import { StakeGoodGateway } from '../websocket/stakegood.gateway';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(AuthNonceEntity)
    private readonly nonceRepo: Repository<AuthNonceEntity>,
    @InjectRepository(KycProfileEntity)
    private readonly kycProfileRepo: Repository<KycProfileEntity>,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshRepo: Repository<RefreshTokenEntity>,
    private readonly gateway: StakeGoodGateway,
  ) { }

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
    try {
      console.log(`[AuthService] Verifying signature for wallet: ${wallet}`);
      console.log(`[AuthService] Nonce: ${nonce}`);
      
      const keypair = Keypair.fromPublicKey(wallet);

      let signatureBuffer: Buffer;
      try {
        if (_signature.length === 128) {
          signatureBuffer = Buffer.from(_signature, 'hex');
        } else {
          signatureBuffer = Buffer.from(_signature, 'base64');
        }
      } catch (e) {
        console.error(`[AuthService] Signature format error: ${e.message}`);
        throw new UnauthorizedException('Formato de assinatura inválido');
      }

      console.log(`[AuthService] Signature (hex prefix): ${signatureBuffer.toString('hex').substring(0, 16)}...`);

      const prefix = 'Stellar Signed Message:\n';
      const msgBuffer = Buffer.from(nonce);
      const hexBuffer = Buffer.from(nonce, 'hex');

      // Estratégias de verificação
      const strategies = [
        { name: 'Raw string', data: msgBuffer },
        { name: 'Raw string (UPPER)', data: Buffer.from(nonce.toUpperCase()) },
        { name: 'Hex bytes', data: hexBuffer },
        
        // SEP-0053 Prefix
        { name: 'SEP-0053 Prefix (string)', data: Buffer.concat([Buffer.from(prefix), msgBuffer]) },
        { name: 'SEP-0053 Prefix (UPPER string)', data: Buffer.concat([Buffer.from(prefix), Buffer.from(nonce.toUpperCase())]) },
        { name: 'SEP-0053 Prefix (hex)', data: Buffer.concat([Buffer.from(prefix), hexBuffer]) },

        // Hashed strategies (Freighter style)
        { name: 'SHA256(Raw string)', data: crypto.createHash('sha256').update(msgBuffer).digest() },
        { name: 'SHA256(Hex bytes)', data: crypto.createHash('sha256').update(hexBuffer).digest() },
        { name: 'SHA256(Prefix + string)', data: crypto.createHash('sha256').update(Buffer.concat([Buffer.from(prefix), msgBuffer])).digest() },
        { name: 'SHA256(Prefix + hex)', data: crypto.createHash('sha256').update(Buffer.concat([Buffer.from(prefix), hexBuffer])).digest() },
        
        // No newline prefix variations
        { name: 'Prefix No NL (string)', data: Buffer.concat([Buffer.from('Stellar Signed Message:'), msgBuffer]) },
        { name: 'SHA256(Prefix No NL + string)', data: crypto.createHash('sha256').update(Buffer.concat([Buffer.from('Stellar Signed Message:'), msgBuffer])).digest() },
      ];

      let isValid = false;
      for (const strategy of strategies) {
        try {
          if (keypair.verify(strategy.data, signatureBuffer)) {
            console.log(`[AuthService] Signature verified using strategy: ${strategy.name}`);
            isValid = true;
            break;
          }
        } catch (e) {
          // console.log(`[AuthService] Strategy ${strategy.name} check failed`);
        }
      }

      if (!isValid) {
        console.error(`[AuthService] All ${strategies.length} verification strategies failed`);
        throw new UnauthorizedException('Assinatura inválida');
      }

    } catch (error) {
      console.error(`[AuthService] Verification error:`, error);
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Erro na verificação da assinatura');
    }


    await this.nonceRepo.update(nonceRecord.id, { usedAt: new Date() });

    let user = await this.userRepo.findOne({ where: { primaryWallet: wallet } });
    if (!user) {
      user = await this.userRepo.save({ primaryWallet: wallet });
    }

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const existingSession = await this.refreshRepo.findOne({
      where: { user: { id: user.id } }
    });

    if (existingSession) {
      await this.refreshRepo.update(existingSession.id, {
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt
      });
    } else {
      await this.refreshRepo.save({
        user,
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt
      });
    }

    const token = this.jwtService.sign({
      sub: wallet,
      userId: user.id,
      kyc_status: user.kycStatus,
      kyc_tier: user.kycTier,
      role: user.role,
    });

    return {
      refresh_token: refreshToken,
      jwt: token,
      wallet,
      kyc_status: user.kycStatus,
      kyc_tier: user.kycTier,
      expires_in: '15m',
      user: {
        id: user.id,
        primary_wallet: user.primaryWallet,
        role: user.role,
        public_visibility: user.publicVisibility,
      },
    };

  }

  async processKycWebhook(dto: KycWebhookDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.externalUserId } });
    if (!user) return { status: 'ignored' };

    const newStatus = dto.review.reviewStatus === 'approved' ? 'verified' : 'rejected';

    // Idempotência: não reverter estado já aprovado
    if (user.kycStatus === 'verified' && newStatus === 'rejected') {
      return { status: 'ignored' };
    }

    await this.userRepo.update(user.id, { kycStatus: newStatus as any });

    const providerId = dto.applicant?.id ?? 'unknown';
    const existing = await this.kycProfileRepo.findOne({ where: { userId: user.id } });

    const profileStatus = newStatus === 'verified' ? 'approved' : 'rejected';
    const now = new Date();

    if (existing) {
      await this.kycProfileRepo.update(existing.id, {
        status: profileStatus,
        providerId,
        verifiedAt: profileStatus === 'approved' ? now : existing.verifiedAt,
        rawData: dto as unknown as Record<string, any>,
      });
    } else {
      await this.kycProfileRepo.save({
        userId: user.id,
        providerId,
        status: profileStatus,
        verifiedAt: profileStatus === 'approved' ? now : undefined,
        rawData: dto as unknown as Record<string, any>,
      });
    }

    this.gateway.emitKycStatusUpdated(user.id, {
      status: newStatus,
      updatedAt: now.toISOString(),
    });

    return { status: 'processed' };
  }

  async refreshToken(refreshToken: string){
    const token= await this.refreshRepo.findOne({ where: { token: refreshToken }, relations: ['user']});

    const now = new Date();

    if(!token || token.revoked){
       throw new BadRequestException('Refresh token not available');
    }
    if(new Date(token.expiresAt).getTime() < now.getTime()){
      throw new BadRequestException('Refresh token expired');
    }

    const user: UserEntity = token.user;

    const newToken = this.jwtService.sign({
      sub: user.primaryWallet,
      userId: user.id,
      kyc_status: user.kycStatus,
      kyc_tier: user.kycTier,
      role: user.role,
    });

    return {
      refresh_token: refreshToken,
      jwt: token,
      wallet: user.primaryWallet,
      kyc_status: user.kycStatus,
      kyc_tier: user.kycTier,
      expires_in: '15m',
      user: {
        id: user.id,
        primary_wallet: user.primaryWallet,
        role: user.role,
        public_visibility: user.publicVisibility,
      },
    };


  }



}
