import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { MarketStatus } from '../../../database/entities/market.entity';

export enum MarketSortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  VOLUME = 'volume',
}

export class ListMarketsQueryDto {
  @IsOptional()
  @IsEnum(['draft', 'active', 'locked', 'resolved'])
  status?: MarketStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsEnum(MarketSortOption)
  sort?: MarketSortOption = MarketSortOption.NEWEST;
}
