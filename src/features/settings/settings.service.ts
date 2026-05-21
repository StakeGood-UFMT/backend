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
import { TwoFactorService } from '../auth/two-factor.service';
import { In } from 'typeorm';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { KycProfileEntity } from '../../database/entities/kyc-profile.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailsEntity)
    private readonly detailsRepo: Repository<UserDetailsEntity>,
    @InjectRepository(UserPositionEntity)
    private readonly positionRepo: Repository<UserPositionEntity>,
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @InjectRepository(KycProfileEntity)
    private readonly kycProfileRepo: Repository<KycProfileEntity>,
    @InjectRepository(NgoEntity)
    private readonly ngoRepo: Repository<NgoEntity>,
    private readonly twoFactorService: TwoFactorService,
  ) {}



  /** Build a compact NGO summary for API responses */
  private mapNgoSummary(ngo: NgoEntity | undefined | null) {
    if (!ngo) return null;
    const social = (ngo as any).social ?? {};
    return {
      id: ngo.id,
      on_chain_id: ngo.onChainId ?? null,
      name: ngo.name,
      slug: ngo.slug,
      category: ngo.category ?? null,
      logo_url: social.logo_url ?? social.logoUrl ?? null,
      website_url: ngo.website ?? null,
      verified: ngo.verified,
    };
  }

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

    const challenges = details.pendingChallenges || {};
    challenges[address] = { nonce, expiresAt };
    await this.detailsRepo.update(details.id, { pendingChallenges: challenges });

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

    const details = await this.getOrCreate(userId);
    const challenges = details.pendingChallenges || {};
    const challenge = challenges[address];

    if (!challenge) {
      throw new BadRequestException(
        'No pending challenge for this wallet. Request a new one.',
      );
    }

    if (Date.now() > challenge.expiresAt) {
      delete challenges[address];
      await this.detailsRepo.update(details.id, { pendingChallenges: challenges });
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
    delete challenges[address];

    // Persist linked wallet
    const alreadyLinked = details.linkedWallets.some(
      (w) => w.address === address,
    );
    let updated = details.linkedWallets;
    if (!alreadyLinked) {
      updated = [
        ...details.linkedWallets,
        { address, linkedAt: new Date().toISOString() },
      ];
    }

    await this.detailsRepo.update(details.id, { 
      pendingChallenges: challenges,
      linkedWallets: updated 
    });

    return {
      linked: true,
      address,
      linkedWallets: updated,
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

  /**
   * Generates a new TOTP secret and QR code for the user.
   * The secret is temporarily stored in memory until verified.
   */
  async initiate2fa(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const details = await this.getOrCreate(userId);
    if (details.totpEnabled) {
      throw new ConflictException('2FA is already enabled');
    }

    const secret = this.twoFactorService.generateSecret();
    const qrCode = await this.twoFactorService.generateQrCode(
      user.primaryWallet,
      secret,
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await this.detailsRepo.update(details.id, {
      pending2faSecret: secret,
      pending2faSecretExpiresAt: expiresAt,
    });

    return {
      qrCode,
      secret, // Providing the secret string as well for manual entry
    };
  }

  /**
   * Verifies the first token and enables 2FA for the user.
   * Only at this point is the secret encrypted and persisted.
   */
  async verifyAndEnable2fa(userId: string, token: string) {
    const details = await this.getOrCreate(userId);
    const secret = details.pending2faSecret;
    const expiresAt = details.pending2faSecretExpiresAt;

    if (!secret || !expiresAt || new Date() > new Date(expiresAt)) {
      throw new BadRequestException(
        '2FA setup not initiated or session expired. Please try again.',
      );
    }

    const isValid = this.twoFactorService.verifyToken(secret, token);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    const encryptedSecret = this.twoFactorService.encryptSecret(secret);

    await this.detailsRepo.update(details.id, {
      totpSecret: encryptedSecret,
      totpEnabled: true,
      pending2faSecret: null,
      pending2faSecretExpiresAt: null,
    });

    return {
      success: true,
      message: 'Two-factor authentication enabled successfully',
    };
  }

  /**
   * Disables 2FA for the user. Requires a valid token for security.
   */
  async disable2fa(userId: string, token: string) {
    const details = await this.getOrCreate(userId);
    if (!details.totpEnabled || !details.totpSecret) {
      throw new BadRequestException('2FA is not enabled');
    }

    const secret = this.twoFactorService.decryptSecret(details.totpSecret);
    const isValid = this.twoFactorService.verifyToken(secret, token);

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.detailsRepo.update(details.id, {
      totpSecret: undefined,
      totpEnabled: false,
    });

    return {
      success: true,
      message: 'Two-factor authentication disabled successfully',
    };
  }

  async getClaims(userId: string) {
    const positions = await this.positionRepo.find({
      where: { userId, status: In(['confirmed', 'resolved', 'claimed']) },
      order: { updatedAt: 'DESC' },
    });

    if (positions.length === 0) return [];

    const marketIds = Array.from(new Set(positions.map((p) => p.marketId)));
    const markets = await this.marketRepo.findBy({ id: In(marketIds) });
    const marketById = new Map(markets.map((m) => [m.id, m]));

    // Gather all ngo onChainIds referenced in those markets
    const allNgoOnChainIds = Array.from(
      new Set(
        markets.flatMap((m) => m.ngoCandidateIds ?? []).filter((id) => id != null),
      ),
    );
    const ngoEntities =
      allNgoOnChainIds.length > 0
        ? await this.ngoRepo.find({ where: { onChainId: In(allNgoOnChainIds) } })
        : [];
    const ngoByOnChainId = new Map(ngoEntities.map((n) => [n.onChainId!, n]));

    return positions.map((p) => {
      const market = marketById.get(p.marketId);
      const claimed = p.status === 'claimed';
      const amount = Number(p.payoutAmount ?? 0);

      // NGO candidates for this market
      const ngoCandidates = (market?.ngoCandidateIds ?? [])
        .map((id) => this.mapNgoSummary(ngoByOnChainId.get(id)))
        .filter(Boolean);

      // NGO the user voted for (stored as ngoOnChainId on the position)
      const votedNgo = p.ngoOnChainId != null
        ? this.mapNgoSummary(ngoByOnChainId.get(p.ngoOnChainId))
        : null;

      return {
        id: p.id,
        market_id: p.marketId,
        market_title: market?.title ?? p.marketId,
        amount,
        claimed,
        can_claim: !claimed && amount > 0,
        market_state: (market?.status ?? 'resolved').toUpperCase(),
        claimed_at: claimed ? p.updatedAt.toISOString() : undefined,
        tx_hash: p.txHash ?? undefined,
        impact_generated_by_user: 0,
        asset_code: market?.assetCode ?? 'XLM',
        amount_staked: Number(p.amountStaked ?? 0),
        outcome: p.outcome,
        position_status: p.status,
        created_at: p.createdAt.toISOString(),
        market_outcome: market?.outcome,
        market_status: market?.status,
        market_lock_at: market?.lockAt ? market.lockAt.toISOString() : undefined,
        ngo_voted: votedNgo,
        ngo_candidates: ngoCandidates,
      };
    });
  }

  async getActivity(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const activityList: any[] = [];

    // 1. KYC Activity
    const kycProfile = await this.kycProfileRepo.findOne({ where: { userId } });
    if (kycProfile) {
      let description = 'Identity verification is currently under review.';
      if (kycProfile.status === 'approved') {
        description = 'Your identity verification was successfully approved.';
      } else if (kycProfile.status === 'rejected') {
        description = 'Your identity verification was rejected.';
      } else if (kycProfile.status === 'expired') {
        description = 'Your identity verification has expired.';
      }
      activityList.push({
        id: kycProfile.id,
        type: 'kyc',
        title: 'KYC Identity Verification',
        description,
        status: kycProfile.status,
        date: kycProfile.verifiedAt || kycProfile.updatedAt || kycProfile.createdAt,
      });
    } else if (user.kycStatus === 'verified') {
      activityList.push({
        id: 'kyc-fallback',
        type: 'kyc',
        title: 'KYC Identity Verification',
        description: 'Your identity verification was successfully approved.',
        status: 'approved',
        date: user.updatedAt || user.createdAt,
      });
    }

    // 2. Gateway Customer Registration
    if (user.anchorCustomerId) {
      activityList.push({
        id: 'gateway-reg',
        type: 'gateway',
        title: 'Gateway Customer Registered',
        description: `Successfully registered in the Fiat ↔ Crypto gateway (ID: ${user.anchorCustomerId}).`,
        status: 'completed',
        date: user.createdAt,
      });
    }

    // 3. Stakes / Predictions
    const positions = await this.positionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (positions.length > 0) {
      const marketIds = Array.from(new Set(positions.map((p) => p.marketId)));
      const markets = await this.marketRepo.findBy({ id: In(marketIds) });
      const marketById = new Map(markets.map((m) => [m.id, m]));

      // Load all NGOs referenced by any position (via ngoOnChainId)
      const ngoOnChainIds = Array.from(
        new Set(positions.map((p) => p.ngoOnChainId).filter((id) => id != null)),
      ) as number[];
      const ngoEntities =
        ngoOnChainIds.length > 0
          ? await this.ngoRepo.find({ where: { onChainId: In(ngoOnChainIds) } })
          : [];
      const ngoByOnChainId = new Map(ngoEntities.map((n) => [n.onChainId!, n]));

      for (const pos of positions) {
        const market = marketById.get(pos.marketId);
        const marketTitle = market?.title ?? pos.marketId;
        const assetCode = market?.assetCode ?? 'CETES';
        
        let desc = `Placed stake of ${Number(pos.amountStaked)} ${assetCode} on "${pos.outcome}" for market "${marketTitle}".`;
        if (pos.status === 'resolved') {
          desc += ` Market resolved. Payout: ${Number(pos.payoutAmount ?? 0)} ${assetCode}.`;
        } else if (pos.status === 'claimed') {
          desc += ` Payout of ${Number(pos.payoutAmount ?? 0)} ${assetCode} claimed.`;
        }

        const votedNgo = pos.ngoOnChainId != null
          ? this.mapNgoSummary(ngoByOnChainId.get(pos.ngoOnChainId))
          : null;

        activityList.push({
          id: pos.id,
          type: 'stake',
          title: `Prediction: ${pos.outcome}`,
          description: desc,
          status: pos.status,
          date: pos.createdAt,
          metadata: {
            marketId: pos.marketId,
            marketTitle,
            amount: Number(pos.amountStaked),
            outcome: pos.outcome,
            txHash: pos.txHash,
            payoutAmount: Number(pos.payoutAmount ?? 0),
            status: pos.status,
            ngo_voted: votedNgo,
          },
        });
      }
    }

    activityList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return activityList;
  }
}
