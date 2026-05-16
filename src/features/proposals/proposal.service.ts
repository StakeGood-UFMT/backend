import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  ProposalEntity,
  ProposalStatus,
} from '../../database/entities/proposal.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ModerateProposalDto } from './dto/moderate-proposal.dto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly proposalRepo: Repository<ProposalEntity>,
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    private readonly config: ConfigService,
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

  async findMine(userId: string, status?: ProposalStatus) {
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
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  private async nextOnChainId(): Promise<string> {
    const maxMarket = await this.marketRepo
      .createQueryBuilder('m')
      .select('COALESCE(MAX(m.on_chain_id), 0)', 'max')
      .getRawOne<{ max: string }>();

    const maxReserved = await this.proposalRepo
      .createQueryBuilder('p')
      .select('COALESCE(MAX(p.reserved_on_chain_id), 0)', 'max')
      .getRawOne<{ max: string }>();

    const a = BigInt(maxMarket?.max ?? '0');
    const b = BigInt(maxReserved?.max ?? '0');
    return (a > b ? a + 1n : b + 1n).toString();
  }

  async buildApprovalXdr(id: string, admin: any) {
    const proposal = await this.findOne(id);

    const repairable =
      proposal.status === ProposalStatus.APPROVED && !proposal.marketId;
    if (proposal.status !== ProposalStatus.PENDING && !repairable) {
      throw new ForbiddenException('Proposal already moderated');
    }

    if (!proposal.reservedOnChainId) {
      proposal.reservedOnChainId = await this.nextOnChainId();
      await this.proposalRepo.save(proposal);
    }

    const feeNgoBps = 200;
    const feePlatformBps = 100;
    const feeGamificationBps = 50;

    return this.adminService.buildCreateMarketXdr({
      adminWallet: admin.wallet,
      marketId: BigInt(proposal.reservedOnChainId),
      lockAt: proposal.lockAt,
      feeNgoBps,
      feePlatformBps,
      feeGamificationBps,
      ngoCandidateIds: proposal.ngoCandidateIds ?? [],
      assetCode: proposal.assetCode,
    });
  }

  async moderate(id: string, dto: ModerateProposalDto, admin: any) {
    const proposal = await this.findOne(id);

    const repairable =
      dto.status === ProposalStatus.APPROVED &&
      proposal.status === ProposalStatus.APPROVED &&
      !proposal.marketId;
    if (proposal.status !== ProposalStatus.PENDING && !repairable) {
      throw new ForbiddenException('Proposal already moderated');
    }

    proposal.moderatedBy = admin.userId;
    proposal.moderatedAt = new Date();
    proposal.rejectionReason = dto.rejectionReason;

    if (dto.status === ProposalStatus.APPROVED) {
      if (!proposal.reservedOnChainId) {
        throw new BadRequestException(
          'Approval XDR not prepared for this proposal',
        );
      }

      const contractId = this.config.get<string>('STELLAR_CONTRACT_ID', '');
      if (!contractId) {
        throw new BadRequestException('STELLAR_CONTRACT_ID is not configured');
      }

      const createdBy = proposal.user?.primaryWallet;

      const market = this.marketRepo.create({
        title: proposal.title,
        description: proposal.description,
        category: proposal.category,
        status: 'active',
        imageUrl: proposal.imageUrl,
        oracleUrl: proposal.oracleUrl,
        lockAt: proposal.lockAt,
        resolveAt: proposal.resolveAt,
        resolutionRule: proposal.resolutionRule,
        resolutionSource: proposal.resolutionSource,
        onChainId: proposal.reservedOnChainId,
        contractAddress: contractId,
        createdBy,
        feeNgo: 0.02,
        feePlatform: 0.01,
        feeGamification: 0.005,
        ngoCandidateIds: proposal.ngoCandidateIds ?? [],
        assetCode: proposal.assetCode || 'XLM',
      });

      const savedMarket = await this.marketRepo.save(market);

      proposal.status = ProposalStatus.APPROVED;
      proposal.marketId = savedMarket.id;
      proposal.rejectionReason = undefined;
      await this.proposalRepo.save(proposal);

      return {
        status: proposal.status,
        marketId: savedMarket.id,
        onChainId: proposal.reservedOnChainId,
      };
    }

    proposal.status = ProposalStatus.REJECTED;
    proposal.reservedOnChainId = undefined;
    proposal.marketId = undefined;
    await this.proposalRepo.save(proposal);

    return { status: proposal.status };
  }
}
