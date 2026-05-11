import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NgoProposalEntity, NgoProposalStatus } from '../../database/entities/ngo-proposal.entity';
import { CreateNgoProposalDto } from './dto/create-ngo-proposal.dto';
import { ModerateNgoProposalDto } from './dto/moderate-ngo-proposal.dto';
import { AdminService } from '../admin/admin.service.js';
import { NgoEntity } from '../../database/entities/ngo.entity';

@Injectable()
export class NgoProposalsService {
  constructor(
    @InjectRepository(NgoProposalEntity)
    private readonly proposalRepo: Repository<NgoProposalEntity>,
    @InjectRepository(NgoEntity)
    private readonly ngoRepo: Repository<NgoEntity>,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
  ) {}

  private buildLinks(dto: CreateNgoProposalDto) {
    const links: Record<string, any> = {};
    if (dto.logoUrl) links.logo_url = dto.logoUrl;
    if (dto.coverUrl) links.cover_url = dto.coverUrl;
    if (dto.auditUrl) links.audit_url = dto.auditUrl;
    if (dto.treasuryUrl) links.treasury_url = dto.treasuryUrl;
    if (dto.certificationUrl) links.certification_url = dto.certificationUrl;
    return links;
  }

  async create(dto: CreateNgoProposalDto, userId: string) {
    const existingPending = await this.proposalRepo.findOne({
      where: { walletAddress: dto.walletAddress, status: NgoProposalStatus.PENDING },
    });
    if (existingPending) {
      throw new BadRequestException('There is already a pending proposal for this wallet.');
    }

    const proposal = this.proposalRepo.create({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      walletAddress: dto.walletAddress,
      website: dto.website,
      links: this.buildLinks(dto),
      userId,
      status: NgoProposalStatus.PENDING,
    });
    return this.proposalRepo.save(proposal);
  }

  async findAll(status?: NgoProposalStatus) {
    const where = status ? { status } : {};
    return this.proposalRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findMine(userId: string, status?: NgoProposalStatus) {
    const where = status ? { userId, status } : { userId };
    return this.proposalRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const proposal = await this.proposalRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!proposal) throw new NotFoundException('NGO proposal not found');
    return proposal;
  }

  private async nextOnChainId(): Promise<number> {
    const maxNgo = await this.ngoRepo
      .createQueryBuilder('n')
      .select('COALESCE(MAX(n.onChainId), 0)', 'max')
      .getRawOne<{ max: string }>();

    const maxReserved = await this.proposalRepo
      .createQueryBuilder('p')
      .select('COALESCE(MAX(p.reservedOnChainId), 0)', 'max')
      .getRawOne<{ max: string }>();

    const a = Number(maxNgo?.max ?? 0);
    const b = Number(maxReserved?.max ?? 0);
    const base = Math.max(Number.isFinite(a) ? a : 0, Number.isFinite(b) ? b : 0);
    return base + 1;
  }

  async buildApprovalXdr(id: string, admin: any) {
    const proposal = await this.findOne(id);

    const repairable =
      proposal.status === NgoProposalStatus.APPROVED && !proposal.ngoId;
    if (proposal.status !== NgoProposalStatus.PENDING && !repairable) {
      throw new ForbiddenException('Proposal already moderated');
    }

    if (!proposal.reservedOnChainId) {
      proposal.reservedOnChainId = await this.nextOnChainId();
      await this.proposalRepo.save(proposal);
    }

    return this.adminService.buildAddNgoXdr({
      adminWallet: admin.wallet,
      ngoId: proposal.reservedOnChainId,
      ngoWallet: proposal.walletAddress,
    });
  }

  async moderate(id: string, dto: ModerateNgoProposalDto, admin: any) {
    const proposal = await this.findOne(id);

    const repairable =
      dto.status === NgoProposalStatus.APPROVED &&
      proposal.status === NgoProposalStatus.APPROVED &&
      !proposal.ngoId;
    if (proposal.status !== NgoProposalStatus.PENDING && !repairable) {
      throw new ForbiddenException('Proposal already moderated');
    }

    proposal.moderatedBy = admin.userId;
    proposal.moderatedAt = new Date();
    proposal.rejectionReason = dto.rejectionReason;

    if (dto.status === NgoProposalStatus.APPROVED) {
      if (!proposal.reservedOnChainId) {
        throw new BadRequestException('Approval XDR not prepared for this proposal');
      }

      const onChainId = proposal.reservedOnChainId;
      const existingNgo = await this.ngoRepo.findOne({
        where: { onChainId },
      });

      const ngo = existingNgo ?? this.ngoRepo.create({
        slug: this.generateSlug(proposal.name, onChainId),
        social: {},
        impactMetrics: {},
      });

      ngo.onChainId = onChainId;
      ngo.walletAddress = proposal.walletAddress;
      ngo.name = proposal.name;
      ngo.description = proposal.description;
      ngo.category = proposal.category;
      ngo.website = proposal.website;
      ngo.social = { ...(ngo.social ?? {}), ...(proposal.links ?? {}) };
      ngo.verified = true;
      ngo.verificationDate = new Date();
      ngo.verifiedBy = admin.userId;

      const savedNgo = await this.ngoRepo.save(ngo);

      proposal.status = NgoProposalStatus.APPROVED;
      proposal.ngoId = savedNgo.id;
      proposal.rejectionReason = undefined;
      await this.proposalRepo.save(proposal);

      return {
        status: proposal.status,
        ngoId: savedNgo.id,
        onChainId: onChainId,
      };
    }

    proposal.status = NgoProposalStatus.REJECTED;
    proposal.reservedOnChainId = undefined;
    proposal.ngoId = undefined;
    await this.proposalRepo.save(proposal);

    return { status: proposal.status };
  }

  private generateSlug(name: string, id: number): string {
    const base = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${base}-${id}`;
  }
}
