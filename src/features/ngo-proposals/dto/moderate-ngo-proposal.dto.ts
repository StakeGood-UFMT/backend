import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NgoProposalStatus } from '../../../database/entities/ngo-proposal.entity';

export class ModerateNgoProposalDto {
  @IsEnum(NgoProposalStatus)
  status: NgoProposalStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
