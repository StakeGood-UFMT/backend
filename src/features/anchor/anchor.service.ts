import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { SavedFiatAccountEntity } from '../../database/entities/saved-fiat-account.entity';
import { QuoteEntity } from '../../database/entities/quote.entity';
import { RampOrderEntity } from '../../database/entities/ramp-order.entity';
import { EtherfuseClient } from './etherfuse/client';

@Injectable()
export class AnchorService {
  private etherfuse: EtherfuseClient;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SavedFiatAccountEntity)
    private readonly fiatAccountRepo: Repository<SavedFiatAccountEntity>,
    @InjectRepository(QuoteEntity)
    private readonly quoteRepo: Repository<QuoteEntity>,
    @InjectRepository(RampOrderEntity)
    private readonly orderRepo: Repository<RampOrderEntity>,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.get<string>('ETHERFUSE_API_KEY', 'test_api_key');
    const baseUrl = this.config.get<string>(
      'ETHERFUSE_BASE_URL',
      'https://api.sand.etherfuse.com',
    );
    this.etherfuse = new EtherfuseClient({ apiKey, baseUrl });
  }

  async getCustomer(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.anchorCustomerId) {
      try {
        const customer = await this.etherfuse.getCustomer({
          customerId: user.anchorCustomerId,
        });
        if (customer) return { customer, user };
      } catch (e) {
        console.warn('Could not fetch existing anchor customer, recreating...', e);
      }
    }

    // Create new customer
    const newCustomer = await this.etherfuse.createCustomer({
      email: `${user.id}@stakegood.com`,
      publicKey: user.primaryWallet,
      country: 'BR',
    });

    user.anchorCustomerId = newCustomer.id;
    await this.userRepo.save(user);

    return { customer: newCustomer, user };
  }

  async getKycUrl(userId: string) {
    const { customer, user } = await this.getCustomer(userId);
    const url = await this.etherfuse.getKycUrl(customer.id, user.primaryWallet);
    return { url };
  }

  async getKycStatus(userId: string) {
    const { customer, user } = await this.getCustomer(userId);
    const status = await this.etherfuse.getKycStatus(customer.id, user.primaryWallet);

    // CRITICAL SYNC: If approved in Anchor, verify user in StakeGood
    if (status === 'approved' && user.kycStatus !== 'verified') {
      user.kycStatus = 'verified';
      await this.userRepo.save(user);
    } else if (status === 'pending' && user.kycStatus !== 'pending') {
      user.kycStatus = 'pending';
      await this.userRepo.save(user);
    }

    return { status, localKycStatus: user.kycStatus };
  }

  async createQuote(userId: string, dto: { fromCurrency: string; toCurrency: string; amount: string }) {
    const { customer, user } = await this.getCustomer(userId);

    const quote = await this.etherfuse.getQuote({
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      fromAmount: dto.amount,
      stellarAddress: user.primaryWallet,
      customerId: customer.id,
    });

    const savedQuote = await this.quoteRepo.save({
      quoteId: quote.id,
      userId,
      fromCurrency: quote.fromCurrency,
      toCurrency: quote.toCurrency,
      fromAmount: quote.fromAmount,
      toAmount: quote.toAmount,
      exchangeRate: quote.exchangeRate,
      fee: quote.fee,
      expiresAt: quote.expiresAt,
    });

    return savedQuote;
  }

  async createOnRamp(
    userId: string,
    dto: { quoteId: string; amount: string; fromCurrency: string; toCurrency: string },
  ) {
    const { customer, user } = await this.getCustomer(userId);

    const tx = await this.etherfuse.createOnRamp({
      customerId: customer.id,
      quoteId: dto.quoteId,
      stellarAddress: user.primaryWallet,
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      amount: dto.amount,
    });

    const order = await this.orderRepo.save({
      orderId: tx.id,
      userId,
      quoteId: dto.quoteId,
      type: 'ON_RAMP',
      status: tx.status as any,
      fromAmount: tx.fromAmount,
      fromCurrency: tx.fromCurrency || dto.fromCurrency,
      toAmount: tx.toAmount,
      toCurrency: tx.toCurrency || dto.toCurrency,
      paymentInstructions: tx.paymentInstructions as any,
    });

    return order;
  }

  async createOffRamp(
    userId: string,
    dto: { quoteId: string; amount: string; fromCurrency: string; toCurrency: string; fiatAccountId: string },
  ) {
    const { customer, user } = await this.getCustomer(userId);

    const tx = await this.etherfuse.createOffRamp({
      customerId: customer.id,
      quoteId: dto.quoteId,
      stellarAddress: user.primaryWallet,
      fromCurrency: dto.fromCurrency,
      toCurrency: dto.toCurrency,
      amount: dto.amount,
      fiatAccountId: dto.fiatAccountId,
    });

    const order = await this.orderRepo.save({
      orderId: tx.id,
      userId,
      quoteId: dto.quoteId,
      type: 'OFF_RAMP',
      status: tx.status as any,
      fromAmount: tx.fromAmount,
      fromCurrency: tx.fromCurrency || dto.fromCurrency,
      toAmount: tx.toAmount,
      toCurrency: tx.toCurrency || dto.toCurrency,
      fiatAccountId: dto.fiatAccountId,
      signableTxXdr: tx.signableTransaction,
    });

    return order;
  }

  async getOrderStatus(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({ where: { orderId, userId } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.type === 'ON_RAMP') {
      const tx = await this.etherfuse.getOnRampTransaction(orderId);
      if (tx) {
        order.status = tx.status as any;
        order.stellarTxHash = tx.stellarTxHash;
        await this.orderRepo.save(order);
      }
    } else {
      const tx = await this.etherfuse.getOffRampTransaction(orderId);
      if (tx) {
        order.status = tx.status as any;
        order.signableTxXdr = tx.signableTransaction;
        order.stellarTxHash = tx.stellarTxHash;
        await this.orderRepo.save(order);
      }
    }

    return order;
  }

  async getUserOrders(userId: string) {
    const orders = await this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return orders;
  }

  async getFiatAccounts(userId: string) {
    const { customer } = await this.getCustomer(userId);
    const accounts = await this.etherfuse.getFiatAccounts(customer.id);
    return accounts;
  }

  async simulatePayment(orderId: string) {
    const status = await this.etherfuse.simulateFiatReceived(orderId);
    return { status };
  }
}
