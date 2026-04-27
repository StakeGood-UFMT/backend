import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProposalStatus } from '../../../database/entities/proposal.entity';

export class ModerateProposalDto {
  @IsEnum(ProposalStatus)
  status: ProposalStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
