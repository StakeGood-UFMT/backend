import { IsIn, IsOptional, IsString } from 'class-validator';

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
}
