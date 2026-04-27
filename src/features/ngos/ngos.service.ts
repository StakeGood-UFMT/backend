import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NgoEntity } from '../../database/entities/ngo.entity';

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
      query.orderBy('n.total_funds_received', 'DESC');
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
}
