import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePrivacyDto {
  /** Show/hide user on the public leaderboard. */
  @IsOptional()
  @IsBoolean()
  publicVisibility?: boolean;

  /** Private mode: hide all positions from other users. */
  @IsOptional()
  @IsBoolean()
  privateMode?: boolean;
}

export class UpdateSpendingLimitsDto {
  /** Maximum spend in USD over the rolling window. 0 = unlimited. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100_000)
  @Type(() => Number)
  spendingLimitUsd?: number;

  /** Rolling window duration in days (1–365). */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  @Type(() => Number)
  spendingWindowDays?: number;
}

export class LinkWalletChallengeDto {
  /** The secondary Stellar wallet address to be linked. */
  address: string;
}

export class LinkWalletVerifyDto {
  /** The secondary wallet address from the challenge step. */
  address: string;

  /** Hex or base64-encoded signature of the challenge nonce. */
  signature: string;

  /** The nonce that was issued in the challenge step. */
  nonce: string;
}

export class UpdateSettingsDto {
  @IsOptional()
  privacy?: UpdatePrivacyDto;

  @IsOptional()
  spending?: UpdateSpendingLimitsDto;
}
