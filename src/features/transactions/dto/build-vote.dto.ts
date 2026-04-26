import { IsUUID, IsInt, Min } from 'class-validator';

export class BuildVoteDto {
  @IsUUID()
  market_id: string;

  @IsUUID()
  ngo_id: string;

  @IsInt()
  @Min(1)
  allocated_votes: number;
}
