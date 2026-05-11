import {
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateNgoProposalDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @IsString()
  @MaxLength(56)
  @Matches(/^G[A-Z2-7]{55}$/, { message: 'Invalid Stellar wallet address format' })
  walletAddress: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsUrl()
  @IsOptional()
  coverUrl?: string;

  @IsUrl()
  @IsOptional()
  auditUrl?: string;

  @IsUrl()
  @IsOptional()
  treasuryUrl?: string;

  @IsUrl()
  @IsOptional()
  certificationUrl?: string;
}
