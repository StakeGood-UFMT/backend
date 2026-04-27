import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermsEntity } from '../../database/entities/terms.entity';
import { FaqEntity } from '../../database/entities/faq.entity';
import { UserDetailsEntity } from '../../database/entities/user-details.entity';

@Injectable()
export class LegalService {
  constructor(
    @InjectRepository(TermsEntity)
    private readonly termsRepo: Repository<TermsEntity>,
    @InjectRepository(FaqEntity)
    private readonly faqRepo: Repository<FaqEntity>,
    @InjectRepository(UserDetailsEntity)
    private readonly userDetailsRepo: Repository<UserDetailsEntity>,
  ) {}

  async getCurrentTerms() {
    const terms = await this.termsRepo.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    
    if (!terms) {
      throw new NotFoundException('Active terms of use not found');
    }
    
    return terms;
  }

  async getFaqItems() {
    return this.faqRepo.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  async acceptTerms(userId: string, version: string) {
    const terms = await this.termsRepo.findOne({ where: { version } });
    if (!terms) {
      throw new NotFoundException(`Terms version ${version} not found`);
    }

    let userDetails = await this.userDetailsRepo.findOne({ where: { userId } });
    
    if (!userDetails) {
      // Create user details if they don't exist yet (though they should be created on user signup)
      userDetails = this.userDetailsRepo.create({ userId });
    }

    userDetails.acceptedTermsVersion = version;
    userDetails.acceptedTermsAt = new Date();

    return this.userDetailsRepo.save(userDetails);
  }
}
