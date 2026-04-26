import { IsUUID } from 'class-validator';

export class BuildClaimDto {
  @IsUUID()
  market_id: string;
}
