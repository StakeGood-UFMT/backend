import { IsString, IsUUID, IsEnum, IsNumberString, Matches } from 'class-validator';

export class BuildPredictionDto {
  @IsUUID()
  market_id: string;

  @IsEnum(['YES', 'NO'])
  outcome: 'YES' | 'NO';

  @IsNumberString()
  @Matches(/^\d+(\.\d{1,8})?$/, { message: 'amount must be a positive decimal' })
  amount: string;
}
