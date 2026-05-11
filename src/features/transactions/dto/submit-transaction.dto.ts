import { IsIn, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class SubmitTransactionDto {
  @IsString()
  signedXdr: string;

  @IsOptional()
  @IsString()
  txHash?: string;

  @IsOptional()
  @IsString()
  market_id?: string;

  @IsOptional()
  @IsIn(['YES', 'NO'])
  outcome?: 'YES' | 'NO';

  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ngo_id?: number;
}
