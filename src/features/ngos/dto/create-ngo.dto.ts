import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsObject,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateNgoDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @IsString()
  @MaxLength(56)
  @Matches(/^G[A-Z2-7]{55}$/, { message: 'Invalid Stellar wallet address format' })
  walletAddress: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsObject()
  @IsOptional()
  social?: Record<string, any>;

  @IsObject()
  @IsOptional()
  impactMetrics?: Record<string, any>;
}
