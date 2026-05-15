import { IsNotEmpty, IsUUID } from 'class-validator';

export class BuildClaimDto {
  @IsNotEmpty()
  @IsUUID()
  claim_id: string;
}
