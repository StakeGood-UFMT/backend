import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
  IsInt,
  Min,
} from 'class-validator';

export class CreateMarketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsDateString()
  @IsNotEmpty()
  lockAt: string;

  @IsDateString()
  @IsNotEmpty()
  resolveAt: string;

  @IsNumber()
  @IsOptional()
  feeNgo?: number;

  @IsNumber()
  @IsOptional()
  feePlatform?: number;

  @IsNumber()
  @IsOptional()
  feeGamification?: number;

  @IsString()
  @IsOptional()
  oracleRef?: string;

  @IsUrl()
  @IsOptional()
  oracleUrl?: string;

  @IsString()
  @IsOptional()
  resolutionRule?: string;

  @IsString()
  @IsOptional()
  resolutionSource?: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  ngoCandidateIds: number[];
}
