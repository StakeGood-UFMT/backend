import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { CreateNgoDto } from './dto/create-ngo.dto';

interface FindAllOptions {
  category?: string;
  verified?: boolean;
  limit: number;
  offset: number;
  sort: string;
}

@Injectable()
export class NgosService {
  constructor(
    @InjectRepository(NgoEntity)
    private readonly ngoRepo: Repository<NgoEntity>,
    @InjectRepository(ImpactLedgerEntryEntity)
    private readonly ledgerRepo: Repository<ImpactLedgerEntryEntity>,
  ) {}

  async findAll(options: FindAllOptions) {
    const query = this.ngoRepo.createQueryBuilder('n');

    if (options.category)
      query.andWhere('n.category = :category', { category: options.category });
    if (options.verified !== undefined)
      query.andWhere('n.verified = :verified', { verified: options.verified });

    if (options.sort === 'alphabetical') {
      query.orderBy('n.name', 'ASC');
    } else {
      query.orderBy('n.totalFundsReceived', 'DESC');
    }

    query.skip(options.offset).take(options.limit);
    const [ngos, total] = await query.getManyAndCount();

    return {
      ngos,
      pagination: {
        total,
        limit: options.limit,
        offset: options.offset,
        has_next: options.offset + options.limit < total,
      },
    };
  }

  async findOne(id: string) {
    const ngo = await this.ngoRepo.findOne({ where: { id } });
    if (!ngo) throw new NotFoundException('NGO not found');
    return ngo;
  }

  async findBySlug(slug: string) {
    const ngo = await this.ngoRepo.findOne({ where: { slug } });
    if (!ngo) throw new NotFoundException('NGO not found');
    return ngo;
  }

  async getTimeline(ngoId: string) {
    return this.ledgerRepo.find({
      where: { ngoId },
      order: { date: 'DESC' },
      take: 50,
    });
  }

  async create(data: CreateNgoDto) {
    const ngo = this.ngoRepo.create(data);
    return this.ngoRepo.save(ngo);
  }

  async update(id: string, data: Partial<CreateNgoDto>) {
    const ngo = await this.findOne(id);
    Object.assign(ngo, data);
    return this.ngoRepo.save(ngo);
  }

  async remove(id: string) {
    const ngo = await this.findOne(id);
    await this.ngoRepo.remove(ngo);
    return { success: true };
  }
}
