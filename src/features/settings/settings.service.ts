import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Keypair } from '@stellar/stellar-sdk';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailsEntity } from '../../database/entities/user-details.entity';
import {
  UpdatePrivacyDto,
  UpdateSpendingLimitsDto,
  LinkWalletChallengeDto,
  LinkWalletVerifyDto,
} from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailsEntity)
    private readonly detailsRepo: Repository<UserDetailsEntity>,
  ) {}

  // ─────────────────────────────────────────────
  //  Internal helpers
  // ─────────────────────────────────────────────

  /** Resolve or lazy-create the UserDetails row for a user. */
  private async getOrCreate(userId: string): Promise<UserDetailsEntity> {
    const existing = await this.detailsRepo.findOne({ where: { userId } });
    if (existing) return existing;

    // Bootstrap from the parent UserEntity defaults
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const details = this.detailsRepo.create({
      userId,
      publicVisibility: user.publicVisibility,
      privateMode: user.privateMode,
      spendingLimitUsd: user.spendingLimitUsd,
      spendingWindowDays: user.spendingWindowDays,
    });

    return this.detailsRepo.save(details);
  }

  // ─────────────────────────────────────────────
  //  GET /settings – returns combined user + details
  // ─────────────────────────────────────────────

  async getSettings(userId: string) {
    const [user, details] = await Promise.all([
      this.userRepo.findOne({ where: { id: userId } }),
      this.getOrCreate(userId),
    ]);

    if (!user) throw new NotFoundException('User not found');

    return {
      profile: {
        id: user.id,
        primaryWallet: user.primaryWallet,
        role: user.role,
        kycStatus: user.kycStatus,
        kycTier: user.kycTier,
        createdAt: user.createdAt,
      },
      privacy: {
        publicVisibility: details.publicVisibility,
        privateMode: details.privateMode,
      },
      spending: {
        spendingLimitUsd: Number(details.spendingLimitUsd),
        spendingWindowDays: details.spendingWindowDays,
      },
      wallets: {
        primary: user.primaryWallet,
        linked: details.linkedWallets,
      },
      security: {
        totpEnabled: details.totpEnabled,
      },
      compliance: {
        acceptedTermsVersion: details.acceptedTermsVersion,
        acceptedTermsAt: details.acceptedTermsAt,
      },
    };
  }

  // ─────────────────────────────────────────────
  //  PATCH /settings/privacy
  // ─────────────────────────────────────────────

  async updatePrivacy(userId: string, dto: UpdatePrivacyDto) {
    const details = await this.getOrCreate(userId);

    const patch: Partial<UserDetailsEntity> = {};
    if (dto.publicVisibility !== undefined) {
      patch.publicVisibility = dto.publicVisibility;
    }
    if (dto.privateMode !== undefined) {
      patch.privateMode = dto.privateMode;
    }

    const updated = await this.detailsRepo.save({ ...details, ...patch });

    // Mirror critical flag back to UserEntity so leaderboard queries stay fast
    if (dto.publicVisibility !== undefined) {
      await this.userRepo.update(userId, {
        publicVisibility: dto.publicVisibility,
      });
    }
    if (dto.privateMode !== undefined) {
      await this.userRepo.update(userId, { privateMode: dto.privateMode });
    }

    return {
      publicVisibility: updated.publicVisibility,
      privateMode: updated.privateMode,
    };
  }

  // ─────────────────────────────────────────────
  //  PATCH /settings/spending
  // ─────────────────────────────────────────────

  async updateSpendingLimits(userId: string, dto: UpdateSpendingLimitsDto) {
    const details = await this.getOrCreate(userId);

    const patch: Partial<UserDetailsEntity> = {};
    if (dto.spendingLimitUsd !== undefined) {
      patch.spendingLimitUsd = dto.spendingLimitUsd;
    }
    if (dto.spendingWindowDays !== undefined) {
      patch.spendingWindowDays = dto.spendingWindowDays;
    }

    const updated = await this.detailsRepo.save({ ...details, ...patch });

    // Mirror to UserEntity
    await this.userRepo.update(userId, {
      ...(dto.spendingLimitUsd !== undefined && {
        spendingLimitUsd: dto.spendingLimitUsd,
      }),
      ...(dto.spendingWindowDays !== undefined && {
        spendingWindowDays: dto.spendingWindowDays,
      }),
    });

    return {
      spendingLimitUsd: Number(updated.spendingLimitUsd),
      spendingWindowDays: updated.spendingWindowDays,
    };
  }

  // ─────────────────────────────────────────────
  //  POST /settings/wallets/challenge
  //  Issues a short-lived nonce for the secondary wallet to sign.
  // ─────────────────────────────────────────────

  /** In-memory nonce store (keyed: `${userId}:${address}`).
   *  In production this should be Redis with a TTL. */
  private readonly pendingChallenges = new Map<
    string,
    { nonce: string; expiresAt: number }
  >();

  async createWalletChallenge(userId: string, dto: LinkWalletChallengeDto) {
    const { address } = dto;

    if (!address || address.length !== 56 || !address.startsWith('G')) {
      throw new BadRequestException('Invalid Stellar wallet address');
    }

    const details = await this.getOrCreate(userId);

    const alreadyLinked = details.linkedWallets.some(
      (w) => w.address === address,
    );
    if (alreadyLinked) {
      throw new ConflictException('Wallet already linked to this account');
    }

    // Check if it's someone's primary wallet
    const taken = await this.userRepo.findOne({
      where: { primaryWallet: address },
    });
    if (taken) {
      throw new ConflictException(
        'Wallet is already registered as a primary wallet',
      );
    }

    const nonce = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min

    this.pendingChallenges.set(`${userId}:${address}`, { nonce, expiresAt });

    return {
      nonce,
      address,
      expiresAt: new Date(expiresAt).toISOString(),
      message: `Sign this nonce to link wallet: ${nonce}`,
    };
  }

  // ─────────────────────────────────────────────
  //  POST /settings/wallets/verify
  //  Validates the signature, then persists the linked wallet.
  // ─────────────────────────────────────────────

  async verifyWalletLink(userId: string, dto: LinkWalletVerifyDto) {
    const { address, signature, nonce } = dto;

    const key = `${userId}:${address}`;
    const challenge = this.pendingChallenges.get(key);

    if (!challenge) {
      throw new BadRequestException(
        'No pending challenge for this wallet. Request a new one.',
      );
    }

    if (Date.now() > challenge.expiresAt) {
      this.pendingChallenges.delete(key);
      throw new BadRequestException('Challenge nonce expired');
    }

    if (challenge.nonce !== nonce) {
      throw new BadRequestException('Nonce mismatch');
    }

    // Verify the signature using the same multi-strategy approach as AuthService
    let isValid = false;
    try {
      const keypair = Keypair.fromPublicKey(address);
      let sigBuf: Buffer;
      try {
        sigBuf =
          signature.length === 128
            ? Buffer.from(signature, 'hex')
            : Buffer.from(signature, 'base64');
      } catch {
        throw new BadRequestException('Invalid signature format');
      }

      const msgBuf = Buffer.from(nonce);
      const hexBuf = Buffer.from(nonce, 'hex');
      const prefix = 'Stellar Signed Message:\n';

      const candidates = [
        msgBuf,
        hexBuf,
        Buffer.concat([Buffer.from(prefix), msgBuf]),
        Buffer.concat([Buffer.from(prefix), hexBuf]),
        crypto.createHash('sha256').update(msgBuf).digest(),
        crypto
          .createHash('sha256')
          .update(Buffer.concat([Buffer.from(prefix), msgBuf]))
          .digest(),
      ];

      for (const data of candidates) {
        try {
          if (keypair.verify(data, sigBuf)) {
            isValid = true;
            break;
          }
        } catch {
          /* try next */
        }
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('Signature verification failed');
    }

    if (!isValid) {
      throw new BadRequestException('Invalid signature for the provided nonce');
    }

    // Clean up nonce
    this.pendingChallenges.delete(key);

    // Persist linked wallet
    const details = await this.getOrCreate(userId);

    const alreadyLinked = details.linkedWallets.some(
      (w) => w.address === address,
    );
    if (!alreadyLinked) {
      const updated = [
        ...details.linkedWallets,
        { address, linkedAt: new Date().toISOString() },
      ];
      await this.detailsRepo.update(details.id, { linkedWallets: updated });
      details.linkedWallets = updated;
    }

    return {
      linked: true,
      address,
      linkedWallets: details.linkedWallets,
    };
  }

  // ─────────────────────────────────────────────
  //  DELETE /settings/wallets/:address
  // ─────────────────────────────────────────────

  async unlinkWallet(userId: string, address: string) {
    const details = await this.getOrCreate(userId);

    const before = details.linkedWallets.length;
    const updated = details.linkedWallets.filter((w) => w.address !== address);

    if (updated.length === before) {
      throw new NotFoundException('Wallet not found in linked wallets');
    }

    await this.detailsRepo.update(details.id, { linkedWallets: updated });

    return { unlinked: true, address, linkedWallets: updated };
  }

  // ─────────────────────────────────────────────
  //  2FA – stub for v2 (schema already present)
  // ─────────────────────────────────────────────

  async get2faStatus(userId: string) {
    const details = await this.getOrCreate(userId);
    return { totpEnabled: details.totpEnabled };
  }
}
