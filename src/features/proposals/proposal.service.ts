import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProposalEntity,
  ProposalStatus,
} from '../../database/entities/proposal.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ModerateProposalDto } from './dto/moderate-proposal.dto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly proposalRepo: Repository<ProposalEntity>,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
  ) {}

  async create(dto: CreateProposalDto, userId: string) {
    const proposal = this.proposalRepo.create({
      ...dto,
      userId,
      status: ProposalStatus.PENDING,
    });
    return this.proposalRepo.save(proposal);
  }

  async findAll(status?: ProposalStatus) {
    const where = status ? { status } : {};
    return this.proposalRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const proposal = await this.proposalRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async moderate(id: string, dto: ModerateProposalDto, admin: any) {
    const proposal = await this.findOne(id);

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new ForbiddenException('Proposal already moderated');
    }

    proposal.status = dto.status;
    proposal.moderatedBy = admin.userId;
    proposal.moderatedAt = new Date();
    proposal.rejectionReason = dto.rejectionReason;

    await this.proposalRepo.save(proposal);

    if (dto.status === ProposalStatus.APPROVED) {
      // Trigger market creation
      // We pass the proposal data to adminService to generate the XDR
      return this.adminService.createMarket(
        {
          title: proposal.title,
          description: proposal.description,
          category: proposal.category,
          imageUrl: proposal.imageUrl,
          oracleUrl: proposal.oracleUrl,
          lockAt: proposal.lockAt.toISOString(),
          resolveAt: proposal.resolveAt.toISOString(),
          resolutionRule: proposal.resolutionRule,
          resolutionSource: proposal.resolutionSource,
        },
        admin,
      );
    }

    return { status: proposal.status };
  }
}
