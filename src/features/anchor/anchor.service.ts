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
import * as StellarSdk from '@stellar/stellar-sdk';

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

  async getKycUrl(userId: string, currency?: string) {
    const { customer, user } = await this.getCustomer(userId);

    const accounts = await this.etherfuse.getFiatAccounts(customer.id);
    const expectedType = currency?.toUpperCase() === 'BRL' ? 'PIX' : 'SPEI';
    const matchingAccount = accounts.find((a) => a.type.toUpperCase() === expectedType);
    const existingBankAccountId = matchingAccount ? matchingAccount.id : undefined;

    const url = await this.etherfuse.getKycUrl(customer.id, user.primaryWallet, existingBankAccountId);
    return { url };
  }


  async getKycStatus(userId: string) {
    const { customer, user } = await this.getCustomer(userId);
    let status = await this.etherfuse.getKycStatus(customer.id, user.primaryWallet);

    // CRITICAL SYNC: If approved in Anchor, verify user in StakeGood
    if (status === 'approved' && user.kycStatus !== 'verified') {
      user.kycStatus = 'verified';
      await this.userRepo.save(user);
    } else if (status === 'pending') {
      // In Sandbox/Dev, if the user was already explicitly verified locally (via Mock Verify or Auto-Approve),
      // do not downgrade them back to pending just because Etherfuse sandbox simulates manual review.
      if (user.kycStatus === 'verified') {
        status = 'approved';
      } else if (user.kycStatus !== 'pending') {
        user.kycStatus = 'pending';
        await this.userRepo.save(user);
      }
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

  async sandboxAutoApproveKyc(userId: string) {
    const { customer, user } = await this.getCustomer(userId);

    try {
      await this.etherfuse.submitKycIdentity(customer.id, {
        pubkey: user.primaryWallet,
        identity: {
          id: user.primaryWallet,
          name: {
            givenName: 'Sandbox',
            familyName: 'AutoApproved',
          },
          dateOfBirth: '1990-01-01',
          address: {
            street: '123 Sandbox Blvd',
            city: 'Mexico City',
            region: 'CDMX',
            postalCode: '01000',
            country: 'MX',
          },
          idNumbers: [
            {
              value: 'SANDBOX1234567890',
              type: 'CURP',
            },
          ],
        },
      });
    } catch (e) {
      console.warn('Etherfuse sandbox auto-approve call returned error or already approved:', e?.message || e);
    }

    try {
      const accounts = await this.etherfuse.getFiatAccounts(customer.id);
      for (const acc of accounts) {
        const presignedUrl = await this.etherfuse.getKycUrl(customer.id, user.primaryWallet, acc.id);
        await this.etherfuse.acceptAgreements(presignedUrl);
        console.log(`Successfully accepted Etherfuse agreements for account ${acc.id} in sandbox.`);
      }
      if (accounts.length === 0) {
        const presignedUrl = await this.etherfuse.getKycUrl(customer.id, user.primaryWallet);
        await this.etherfuse.acceptAgreements(presignedUrl);
        console.log('Successfully accepted Etherfuse agreements for new customer in sandbox.');
      }
    } catch (e) {
      console.warn('Etherfuse sandbox accept agreements call returned error:', e?.message || e);
    }

    if (user.kycStatus !== 'verified') {
      user.kycStatus = 'verified';
      await this.userRepo.save(user);
    }

    return { status: 'approved', localKycStatus: user.kycStatus };
  }

  async createTrustline(userId: string, dto: { assetCode: string; assetIssuer: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const horizonUrl = this.config.get<string>(
      'STELLAR_HORIZON_URL',
      'https://horizon-testnet.stellar.org',
    );
    const networkPassphrase = this.config.get<string>(
      'STELLAR_NETWORK_PASSPHRASE',
      StellarSdk.Networks.TESTNET,
    );

    const horizon = new StellarSdk.Horizon.Server(horizonUrl);
    const account = await horizon.loadAccount(user.primaryWallet);
    const asset = new StellarSdk.Asset(dto.assetCode, dto.assetIssuer);

    const op = StellarSdk.Operation.changeTrust({
      asset,
    });

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '10000',
      networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    return { xdr: tx.toXDR() };
  }
}
