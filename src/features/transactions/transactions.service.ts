import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as StellarSdk from '@stellar/stellar-sdk';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../database/entities/user.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { DepositEntity } from '../../database/entities/deposit.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { BuildPredictionDto } from './dto/build-prediction.dto';
import { BuildClaimDto } from './dto/build-claim.dto';
import { SubmitTransactionDto } from './dto/submit-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @InjectRepository(MarketSnapshotEntity)
    private readonly snapshotRepo: Repository<MarketSnapshotEntity>,
    @InjectRepository(DepositEntity)
    private readonly depositRepo: Repository<DepositEntity>,
    @InjectRepository(UserPositionEntity)
    private readonly userPositionRepo: Repository<UserPositionEntity>,
    private readonly config: ConfigService,
  ) {}

  private getNetworkPassphrase(): string {
    return this.config.get<string>(
      'STELLAR_NETWORK_PASSPHRASE',
      StellarSdk.Networks.TESTNET,
    );
  }

  private getRpcServer(): StellarSdk.rpc.Server {
    const rpcUrl = this.config.get<string>(
      'STELLAR_RPC_URL',
      'https://soroban-testnet.stellar.org',
    );
    return new StellarSdk.rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith('http://'),
    });
  }

  private getHorizonServer(): StellarSdk.Horizon.Server {
    const horizonUrl = this.config.get<string>(
      'STELLAR_HORIZON_URL',
      'https://horizon-testnet.stellar.org',
    );
    return new StellarSdk.Horizon.Server(horizonUrl);
  }

  private parseAddress(address: string, label: string): StellarSdk.Address {
    try {
      if (!address) throw new Error('Address is empty');
      return StellarSdk.Address.fromString(address);
    } catch (e) {
      throw new BadRequestException(`Invalid Stellar address for ${label}: ${address}`);
    }
  }

  async buildPrediction(dto: BuildPredictionDto, jwtUser: any) {
    const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
    if (!user) throw new NotFoundException('User not found');

    // Validation: KYC Status
    if (user.kycStatus !== 'verified') {
      throw new ForbiddenException({
        error: 'KYC_REQUIRED',
        kyc_status: user.kycStatus,
        message: 'Verified KYC is required to place predictions.',
      });
    }

    // Validation: Spending Limit (BE-6A)
    await this.checkSpendingLimit(user, parseFloat(dto.amount));

    const market = await this.marketRepo.findOne({
      where: { id: dto.market_id },
    });
    if (!market) throw new NotFoundException('Market not found');
    if (!market.onChainId) {
      throw new BadRequestException('Market is missing onChainId');
    }
    const contractId =
      market.contractAddress || this.config.get<string>('STELLAR_CONTRACT_ID', '');
    if (!contractId) {
      throw new BadRequestException('STELLAR_CONTRACT_ID is not configured');
    }

    // Validation: Market Status and Lock Time
    if (market.status !== 'active') {
      throw new BadRequestException('Market is not active');
    }
    if (new Date() >= market.lockAt) {
      throw new BadRequestException('Market is locked for betting');
    }

    // Validation: Hedge Lock (Anti-Hedge)
    // Users cannot bet on the opposite outcome if they already have a position
    const existingPosition = await this.userPositionRepo.findOne({
      where: { userId: user.id, marketId: market.id },
    });

    if (existingPosition && existingPosition.outcome !== dto.outcome) {
      throw new ConflictException({
        error: 'HEDGE_LOCK_VIOLATION',
        message:
          'Hedging is not allowed. You already have a position on the opposite outcome in this market.',
        existing_outcome: existingPosition.outcome,
      });
    }

    const snapshot = await this.snapshotRepo.findOne({
      where: { marketId: market.id },
      order: { timestamp: 'DESC' },
    });

    let yesPool = snapshot ? parseFloat(snapshot.yesPool as any) : 0;
    let noPool = snapshot ? parseFloat(snapshot.noPool as any) : 0;

    if (!snapshot) {
      const row = await this.userPositionRepo
        .createQueryBuilder('p')
        .select(
          "COALESCE(SUM(CASE WHEN p.outcome = 'YES' THEN p.amount_staked ELSE 0 END), 0)",
          'yes',
        )
        .addSelect(
          "COALESCE(SUM(CASE WHEN p.outcome = 'NO' THEN p.amount_staked ELSE 0 END), 0)",
          'no',
        )
        .where('p.market_id = :marketId', { marketId: market.id })
        .andWhere("p.status IN ('pending','confirmed','resolved','claimed')")
        .getRawOne<{ yes: string; no: string }>();
      yesPool = Number(row?.yes ?? 0);
      noPool = Number(row?.no ?? 0);
    }

    if (yesPool + noPool <= 0) {
      yesPool = 1;
      noPool = 1;
    }
    const amount = parseFloat(dto.amount);

    const impliedProbability = yesPool / (yesPool + noPool);
    const payoutMultiplier =
      dto.outcome === 'YES'
        ? (yesPool + noPool + amount) / (yesPool + amount)
        : (yesPool + noPool + amount) / (noPool + amount);
    const potentialWin = amount * payoutMultiplier;

    // Soroban XDR Generation
    // Function: place_prediction(user: Address, market_id: u64, outcome: u32, amount: i128, ngo_id: u32)
    const amountStroops = BigInt(Math.floor(amount * 10000000)); // 7 decimals for USDC/SAC

    const marketIdU64 = BigInt(market.onChainId);
    const outcomeU32 = dto.outcome === 'YES' ? 1 : 2;
    const ngoIdU32 = Number(dto.ngo_id);
    if (!Number.isInteger(ngoIdU32) || ngoIdU32 <= 0) {
      throw new BadRequestException('ngo_id must be a positive integer');
    }
    const candidates = Array.isArray((market as any).ngoCandidateIds)
      ? (market as any).ngoCandidateIds.map((n: any) => Number(n))
      : [];
    if (candidates.length && !candidates.includes(ngoIdU32)) {
      throw new BadRequestException('ngo_id is not allowed for this market');
    }

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            this.parseAddress(contractId, 'contract').toScAddress(),
          functionName: 'place_prediction',
          args: [
            StellarSdk.nativeToScVal(
              this.parseAddress(user.primaryWallet, 'user wallet'),
            ),
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
            StellarSdk.nativeToScVal(outcomeU32, { type: 'u32' }),
            StellarSdk.nativeToScVal(amountStroops, { type: 'i128' }),
            StellarSdk.nativeToScVal(ngoIdU32, { type: 'u32' }),
          ],
        }),
      ),
      auth: [],
    });

    if (this.config.get<string>('NODE_ENV') === 'test') {
      const networkPassphrase = this.getNetworkPassphrase();
      const tx = new StellarSdk.TransactionBuilder(
        new StellarSdk.Account(user.primaryWallet, '0'),
        { fee: '10000', networkPassphrase },
      )
        .addOperation(op)
        .setTimeout(StellarSdk.TimeoutInfinite)
        .build();

      const xdr = tx.toXDR();
      return {
        xdr,
        txHash: tx.hash().toString('hex'),
        summary: {
          action: 'place_prediction',
          market: { id: market.id, title: market.title },
          outcome: dto.outcome,
          amount: `${dto.amount} ${market.assetCode || 'XLM'}`,
          implied_probability: impliedProbability.toFixed(3),
          implied_odds: payoutMultiplier.toFixed(2),
          potential_win: `${potentialWin.toFixed(2)} ${market.assetCode || 'XLM'}`,
        },
      };
    }

    const networkPassphrase = this.getNetworkPassphrase();
    const horizon = this.getHorizonServer();
    const rpc = this.getRpcServer();

    const account = await horizon.loadAccount(user.primaryWallet);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '10000',
      networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    const sim = await rpc.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationError(sim)) {
      throw new BadRequestException(sim.error);
    }
    if (!StellarSdk.rpc.Api.isSimulationSuccess(sim)) {
      throw new BadRequestException('Simulation failed');
    }

    const assembled = StellarSdk.rpc.assembleTransaction(tx, sim).build();
    const xdr = assembled.toXDR();

    return {
      xdr,
      txHash: assembled.hash().toString('hex'),
      summary: {
        action: 'place_prediction',
        market: { id: market.id, title: market.title },
        outcome: dto.outcome,
        amount: `${dto.amount} ${market.assetCode || 'XLM'}`,
        implied_probability: impliedProbability.toFixed(3),
        implied_odds: payoutMultiplier.toFixed(2),
        potential_win: `${potentialWin.toFixed(2)} ${market.assetCode || 'XLM'}`,
      },
    };
  }

  async buildClaim(dto: BuildClaimDto, jwtUser: any) {
    const user = await this.userRepo.findOne({ where: { id: jwtUser.userId } });
    if (!user) throw new NotFoundException('User not found');

    const position = await this.userPositionRepo.findOne({
      where: { id: dto.claim_id, userId: user.id },
    });

    if (!position) throw new NotFoundException('Claimable position not found');
    if (position.status === 'claimed') {
      throw new BadRequestException('Reward already claimed');
    }
    if (position.status !== 'resolved') {
      throw new BadRequestException('Position is not resolved yet');
    }

    const market = await this.marketRepo.findOne({
      where: { id: position.marketId },
    });
    if (!market) throw new NotFoundException('Market not found');
    if (!market.onChainId) {
      throw new BadRequestException('Market is missing onChainId');
    }

    const contractId =
      market.contractAddress ||
      this.config.get<string>('STELLAR_CONTRACT_ID', '');
    if (!contractId) {
      throw new BadRequestException('STELLAR_CONTRACT_ID is not configured');
    }

    const marketIdU64 = BigInt(market.onChainId);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            this.parseAddress(contractId, 'contract').toScAddress(),
          functionName: 'claim_reward',
          args: [
            StellarSdk.nativeToScVal(
              this.parseAddress(user.primaryWallet, 'user wallet'),
            ),
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
          ],
        }),
      ),
      auth: [],
    });

    const networkPassphrase = this.getNetworkPassphrase();

    if (this.config.get<string>('NODE_ENV') === 'test') {
      const tx = new StellarSdk.TransactionBuilder(
        new StellarSdk.Account(user.primaryWallet, '0'),
        { fee: '10000', networkPassphrase },
      )
        .addOperation(op)
        .setTimeout(StellarSdk.TimeoutInfinite)
        .build();

      return {
        xdr: tx.toXDR(),
        txHash: tx.hash().toString('hex'),
        summary: {
          action: 'claim_reward',
          market: { id: market.id, title: market.title },
          amount: `${position.payoutAmount} ${market.assetCode || 'XLM'}`,
        },
      };
    }

    const horizon = this.getHorizonServer();
    const rpc = this.getRpcServer();

    const account = await horizon.loadAccount(user.primaryWallet);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '10000',
      networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    const sim = await rpc.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationError(sim)) {
      throw new BadRequestException(sim.error);
    }
    if (!StellarSdk.rpc.Api.isSimulationSuccess(sim)) {
      throw new BadRequestException('Simulation failed');
    }

    const assembled = StellarSdk.rpc.assembleTransaction(tx, sim).build();
    const xdr = assembled.toXDR();

    return {
      xdr,
      txHash: assembled.hash().toString('hex'),
      summary: {
        action: 'claim_reward',
        market: { id: market.id, title: market.title },
        amount: `${position.payoutAmount} ${market.assetCode || 'XLM'}`,
      },
    };
  }

  private async checkSpendingLimit(user: UserEntity, amount: number) {
    const spendingLimit = Number(user.spendingLimitUsd);
    const spendingWindowDays = Number(user.spendingWindowDays);

    if (!Number.isFinite(spendingLimit) || spendingLimit <= 0) {
      return;
    }
    if (!Number.isFinite(spendingWindowDays) || spendingWindowDays <= 0) {
      return;
    }

    const windowStart = new Date(
      Date.now() - spendingWindowDays * 24 * 60 * 60 * 1000,
    );

    const result = await this.userPositionRepo
      .createQueryBuilder('up')
      .select('COALESCE(SUM(up.amount_staked), 0)', 'total')
      .where('up.user_id = :userId', { userId: user.id })
      .andWhere('up.created_at >= :windowStart', { windowStart })
      .andWhere("up.status = 'confirmed'")
      .getRawOne<{ total: string }>();

    const totalSpent = parseFloat(result?.total ?? '0');
    const remaining = Math.max(0, spendingLimit - totalSpent);

    if (totalSpent + amount > spendingLimit) {
      throw new ForbiddenException({
        error: 'SPENDING_LIMIT_EXCEEDED',
        message: `Spending limit exceeded. Your ${spendingWindowDays}-day limit is ${spendingLimit.toFixed(2)} USDC.`,
        remaining: remaining.toFixed(2),
        limit: spendingLimit.toFixed(2),
        window_days: spendingWindowDays,
      });
    }
  }

  async getTxStatus(hash: string) {
    if (!hash || !/^[0-9a-fA-F]{64}$/.test(hash)) {
      throw new BadRequestException('Invalid transaction hash');
    }

    const rpc = this.getRpcServer();
    const result: any = await rpc.getTransaction(hash);

    const rawStatus = String(result?.status ?? '').toUpperCase();
    const normalizedStatus =
      rawStatus === 'SUCCESS'
        ? 'confirmed'
        : rawStatus === 'FAILED' || rawStatus === 'ERROR'
          ? 'failed'
          : 'pending';

    if (normalizedStatus === 'confirmed') {
      await this.userPositionRepo.update(
        { txHash: hash, status: 'pending' },
        { status: 'confirmed' },
      );
    } else if (normalizedStatus === 'failed') {
      await this.userPositionRepo.update(
        { txHash: hash, status: 'pending' },
        { status: 'cancelled' },
      );
    }

    return {
      hash,
      status: normalizedStatus,
      rawStatus,
      latestLedger: result?.latestLedger,
      latestLedgerCloseTime: result?.latestLedgerCloseTime,
      ledger: result?.ledger,
      createdAt: result?.createdAt,
    };
  }

  async submit(dto: SubmitTransactionDto, jwtUser: any) {
    if (this.config.get<string>('NODE_ENV') === 'test') {
      return { status: 'PENDING', hash: 'test' };
    }
    const networkPassphrase = this.getNetworkPassphrase();
    const rpc = this.getRpcServer();

    let tx: StellarSdk.Transaction;
    try {
      tx = StellarSdk.TransactionBuilder.fromXDR(dto.signedXdr, networkPassphrase) as StellarSdk.Transaction;
    } catch {
      throw new BadRequestException('Invalid signedXdr');
    }

    const send = await rpc.sendTransaction(tx);
    if (send.status === 'ERROR') {
      const detail =
        (send as any).errorResult ||
        (send as any).errorResultXdr ||
        'Transaction failed';
      throw new BadRequestException(detail);
    }

    const txHash =
      dto.txHash && /^[0-9a-fA-F]{64}$/.test(dto.txHash)
        ? dto.txHash
        : String((send as any).hash ?? tx.hash().toString('hex'));

    const amountNumber = dto.amount ? Number(dto.amount) : NaN;
    const ngoOnChainId =
      dto.ngo_id !== undefined && dto.ngo_id !== null ? Number(dto.ngo_id) : NaN;
    const canPersistPosition =
      jwtUser?.userId &&
      dto.market_id &&
      (dto.outcome === 'YES' || dto.outcome === 'NO') &&
      Number.isFinite(amountNumber) &&
      amountNumber > 0;

    if (canPersistPosition) {
      await this.userPositionRepo.save({
        userId: jwtUser.userId,
        marketId: dto.market_id!,
        outcome: dto.outcome!,
        amountStaked: amountNumber,
        status: 'pending',
        txHash,
        ngoOnChainId: Number.isFinite(ngoOnChainId) ? ngoOnChainId : undefined,
      });
    }

    return send;
  }
}
