import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MarketEntity } from '../../database/entities/market.entity';
import { AuditLogEntity } from '../../database/entities/audit-log.entity';
import { TxIntentEntity } from '../../database/entities/tx-intent.entity';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { CreateMarketDto } from './dto/create-market.dto';
import * as StellarSdk from '@stellar/stellar-sdk';
import { ConfigService } from '@nestjs/config';

interface AdminContext {
  userId: string;
  wallet: string;
  [key: string]: any;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
    @InjectRepository(TxIntentEntity)
    private readonly intentRepo: Repository<TxIntentEntity>,
    @InjectRepository(ImpactLedgerEntryEntity)
    private readonly ledgerRepo: Repository<ImpactLedgerEntryEntity>,
    private readonly dataSource: DataSource,
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

  private getContractId(): string {
    const contractId = this.config.get<string>('STELLAR_CONTRACT_ID', '');
    if (!contractId) {
      throw new BadRequestException('STELLAR_CONTRACT_ID is not configured');
    }
    return contractId;
  }

  private getAssetContractId(): string {
    const configured = this.config.get<string>('STELLAR_ASSET_CONTRACT_ID');
    if (configured) return configured;

    const passphrase = this.getNetworkPassphrase();
    const assetCode = this.config.get<string>('STELLAR_ASSET_CODE');
    const assetIssuer = this.config.get<string>('STELLAR_ASSET_ISSUER');

    try {
      if (assetCode && assetIssuer) {
        return new StellarSdk.Asset(assetCode, assetIssuer).contractId(
          passphrase,
        );
      }
      return StellarSdk.Asset.native().contractId(passphrase);
    } catch {
      throw new BadRequestException(
        'Unable to derive asset contract id. Set STELLAR_ASSET_CONTRACT_ID (or STELLAR_ASSET_CODE + STELLAR_ASSET_ISSUER).',
      );
    }
  }

  private toBps(value: number | undefined, fallbackBps: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) return fallbackBps;
    const bps = Math.round(value * 10_000);
    return Math.max(0, Math.min(10_000, bps));
  }

  private buildFeesScVal(feeNgoBps: number, feePlatformBps: number, feeGamificationBps: number) {
    // Important: Soroban requires map keys to be sorted for host conversion.
    // Keys sorted lexicographically: fee_ngo, gamification, platform
    return StellarSdk.xdr.ScVal.scvMap([
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.nativeToScVal('fee_ngo', { type: 'symbol' }),
        val: StellarSdk.nativeToScVal(feeNgoBps, { type: 'u32' }),
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.nativeToScVal('gamification', { type: 'symbol' }),
        val: StellarSdk.nativeToScVal(feeGamificationBps, { type: 'u32' }),
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.nativeToScVal('platform', { type: 'symbol' }),
        val: StellarSdk.nativeToScVal(feePlatformBps, { type: 'u32' }),
      }),
    ]);
  }

  private async buildSimulatedXdr(sourceWallet: string, op: any): Promise<{ xdr: string; txHash: string }> {
    const networkPassphrase = this.getNetworkPassphrase();
    const horizon = this.getHorizonServer();
    const rpc = this.getRpcServer();

    const account = await horizon.loadAccount(sourceWallet);
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
    return { xdr: assembled.toXDR(), txHash: assembled.hash().toString('hex') };
  }

  async buildCreateMarketXdr(params: {
    adminWallet: string;
    marketId: bigint;
    lockAt: Date;
    feeNgoBps: number;
    feePlatformBps: number;
    feeGamificationBps: number;
    oracleWallet?: string;
    assetContractId?: string;
  }): Promise<{ xdr: string; txHash: string; onChainId: string }> {
    const contractId = this.getContractId();
    const oracleWallet = params.oracleWallet ?? params.adminWallet;
    const assetContractId = params.assetContractId ?? this.getAssetContractId();

    const lockTs = BigInt(Math.floor(params.lockAt.getTime() / 1000));
    const adminAddr = StellarSdk.Address.fromString(params.adminWallet);
    const oracleAddr = StellarSdk.Address.fromString(oracleWallet);
    const assetAddr = StellarSdk.Address.fromString(assetContractId);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'create_market',
          args: [
            StellarSdk.nativeToScVal(adminAddr),
            StellarSdk.nativeToScVal(params.marketId, { type: 'u64' }),
            StellarSdk.nativeToScVal(assetAddr),
            StellarSdk.nativeToScVal(oracleAddr),
            StellarSdk.nativeToScVal(lockTs, { type: 'u64' }),
            this.buildFeesScVal(
              params.feeNgoBps,
              params.feePlatformBps,
              params.feeGamificationBps,
            ),
          ],
        }),
      ),
      auth: [],
    });

    const built = await this.buildSimulatedXdr(params.adminWallet, op);
    return { ...built, onChainId: params.marketId.toString() };
  }

  private async getNextMarketId(): Promise<bigint> {
    const row = await this.marketRepo
      .createQueryBuilder('m')
      .select('COALESCE(MAX(m.on_chain_id), 0)', 'max')
      .getRawOne<{ max: string }>();
    const max = BigInt(row?.max ?? '0');
    return max + 1n;
  }

  async createMarket(dto: CreateMarketDto, admin: AdminContext) {
    const onChainId = await this.getNextMarketId();
    const lockAt = new Date(dto.lockAt);

    const feeNgoBps = this.toBps(dto.feeNgo, 200);
    const feePlatformBps = this.toBps(dto.feePlatform, 100);
    const feeGamificationBps = this.toBps(dto.feeGamification, 50);

    const { xdr, txHash } = await this.buildCreateMarketXdr({
      adminWallet: admin.wallet,
      marketId: onChainId,
      lockAt,
      feeNgoBps,
      feePlatformBps,
      feeGamificationBps,
    });

    await this.dataSource.transaction(async (manager) => {
      await manager.save(TxIntentEntity, {
        adminId: admin.userId,
        action: 'CREATE_MARKET',
        xdr,
        status: 'pending',
      });

      await manager.save(AuditLogEntity, {
        adminId: admin.userId,
        action: 'CREATE_MARKET',
        targetType: 'MARKET',
        payload: dto,
      });
    });

    return { xdr, txHash, on_chain_id: onChainId.toString(), action: 'CREATE_MARKET' };
  }

  async resolveMarket(id: string, outcome: 'YES' | 'NO', admin: AdminContext) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');
    if (!(market.lockAt instanceof Date) || !Number.isFinite(market.lockAt.getTime())) {
      throw new BadRequestException('Market has no valid lock date');
    }
    if (new Date() < market.lockAt) {
      throw new BadRequestException('Market is not locked yet');
    }

    const contractId =
      market.contractAddress ||
      this.config.get<string>(
        'STELLAR_CONTRACT_ID',
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      );
    const marketIdU64 = BigInt(market.onChainId || 0);
    const outcomeU32 = outcome === 'YES' ? 1 : 2;
    const oracleAddr = StellarSdk.Address.fromString(admin.wallet);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'resolve_market',
          args: [
            StellarSdk.nativeToScVal(oracleAddr),
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
            StellarSdk.nativeToScVal(outcomeU32, { type: 'u32' }),
          ],
        }),
      ),
      auth: [],
    });

    const built = await this.buildSimulatedXdr(admin.wallet, op);
    const xdr = built.xdr;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(TxIntentEntity, {
        adminId: admin.userId,
        action: 'RESOLVE_MARKET',
        xdr,
        status: 'pending',
      });

      await manager.save(AuditLogEntity, {
        adminId: admin.userId,
        action: 'RESOLVE_MARKET',
        targetType: 'MARKET',
        targetId: id,
        payload: { outcome },
      });
    });

    return { xdr, txHash: built.txHash, action: 'RESOLVE_MARKET' };
  }

  async cancelMarket(id: string, admin: AdminContext) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const contractId =
      market.contractAddress ||
      this.config.get<string>(
        'STELLAR_CONTRACT_ID',
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      );
    const marketIdU64 = BigInt(market.onChainId || 0);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'cancel_market',
          args: [StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' })],
        }),
      ),
      auth: [],
    });

    const xdr = this.buildXdr(admin.wallet, op);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(TxIntentEntity, {
        adminId: admin.userId,
        action: 'CANCEL_MARKET',
        xdr,
        status: 'pending',
      });

      await manager.save(AuditLogEntity, {
        adminId: admin.userId,
        action: 'CANCEL_MARKET',
        targetType: 'MARKET',
        targetId: id,
      });
    });

    return { xdr, action: 'CANCEL_MARKET' };
  }

  async distributeImpact(id: string, admin: AdminContext) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const contractId =
      market.contractAddress ||
      this.config.get<string>(
        'STELLAR_CONTRACT_ID',
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      );
    const marketIdU64 = BigInt(market.onChainId || 0);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'distribute_impact_funds',
          args: [StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' })],
        }),
      ),
      auth: [],
    });

    const xdr = this.buildXdr(admin.wallet, op);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(TxIntentEntity, {
        adminId: admin.userId,
        action: 'DISTRIBUTE_IMPACT',
        xdr,
        status: 'pending',
      });

      await manager.save(AuditLogEntity, {
        adminId: admin.userId,
        action: 'DISTRIBUTE_IMPACT',
        targetType: 'MARKET',
        targetId: id,
      });

      // Optional: Preliminary ledger entries or marking for distribution
      // Actual ledger update usually happens after SC event confirmation
    });

    return { xdr, action: 'DISTRIBUTE_IMPACT' };
  }

  private buildXdr(wallet: string, op: any): string {
    const networkPassphrase = this.getNetworkPassphrase();
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(wallet, '0'),
      { fee: '10000', networkPassphrase },
    )
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    return tx.toXDR();
  }
}
