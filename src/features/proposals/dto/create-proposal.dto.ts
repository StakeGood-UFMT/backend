import {
  IsString,
  IsOptional,
  IsDateString,
  IsUrl,
  MaxLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
  IsInt,
  Min,
} from 'class-validator';

export class CreateProposalDto {
  @IsString()
  @MaxLength(500)
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

  @IsUrl()
  @IsOptional()
  oracleUrl?: string;

  @IsDateString()
  lockAt: string;

  @IsDateString()
  resolveAt: string;

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
