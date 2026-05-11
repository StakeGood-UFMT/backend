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

  private parseAddress(address: string, label: string): StellarSdk.Address {
    try {
      if (!address) throw new Error('Address is empty');
      return StellarSdk.Address.fromString(address);
    } catch (e) {
      throw new BadRequestException(`Invalid Stellar address for ${label}: ${address}`);
    }
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

  private extractContractErrorCode(message: unknown): number | null {
    const text = typeof message === 'string' ? message : '';
    const m = text.match(/Error\(Contract,\s*#(\d+)\)/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : null;
  }

  private marketOutcomeFromWinningOutcome(winningOutcome: unknown): 'YES' | 'NO' | null {
    const n =
      typeof winningOutcome === 'number'
        ? winningOutcome
        : typeof winningOutcome === 'bigint'
          ? Number(winningOutcome)
          : null;
    if (n === 1) return 'YES';
    if (n === 2) return 'NO';
    return null;
  }

  private decodeContractDataValueFromLedgerEntryXdr(xdrB64: string): StellarSdk.xdr.ScVal | null {
    try {
      const data = StellarSdk.xdr.LedgerEntryData.fromXDR(xdrB64, 'base64');
      if (data.switch() !== StellarSdk.xdr.LedgerEntryType.contractData()) return null;
      return data.contractData().val();
    } catch {}

    try {
      const entry = StellarSdk.xdr.LedgerEntry.fromXDR(xdrB64, 'base64');
      const data = entry.data();
      if (data.switch() !== StellarSdk.xdr.LedgerEntryType.contractData()) return null;
      return data.contractData().val();
    } catch {}

    return null;
  }

  private async getOnChainMarket(contractId: string, marketId: bigint): Promise<any | null> {
    const rpc = this.getRpcServer();
    const contractScAddress = this.parseAddress(contractId, 'contract').toScAddress();

    const storageKey = StellarSdk.xdr.ScVal.scvVec([
      StellarSdk.nativeToScVal('MarketId', { type: 'symbol' }),
      StellarSdk.nativeToScVal(marketId, { type: 'u64' }),
    ]);

    const ledgerKey = StellarSdk.xdr.LedgerKey.contractData(
      new StellarSdk.xdr.LedgerKeyContractData({
        contract: contractScAddress,
        key: storageKey,
        durability: StellarSdk.xdr.ContractDataDurability.persistent(),
      }),
    );

    const resp = await rpc.getLedgerEntries(ledgerKey);
    const entryAny = ((resp as any)?.entries ?? [])[0] as any;
    const xdrB64: string | undefined = entryAny?.xdr ?? entryAny?.data?.xdr;
    if (!xdrB64) return null;

    const val = this.decodeContractDataValueFromLedgerEntryXdr(xdrB64);
    if (!val) return null;

    const native = StellarSdk.scValToNative(val);
    if (native instanceof Map) {
      return Object.fromEntries(Array.from(native.entries()).map(([k, v]) => [String(k), v]));
    }
    return native;
  }

  async setMarketStatus(id: string, status: 'draft' | 'active', admin: AdminContext) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');
    if (market.status === 'resolved') {
      throw new BadRequestException('Resolved markets cannot be modified');
    }

    const now = new Date();
    if (status === 'draft' && market.lockAt instanceof Date && now >= market.lockAt) {
      throw new BadRequestException('Cannot deactivate a market after lock time');
    }

    await this.marketRepo.update({ id }, { status });

    await this.auditRepo.save({
      adminId: admin.userId,
      action: 'SET_MARKET_STATUS',
      targetType: 'MARKET',
      targetId: id,
      payload: { status },
    });

    return { ok: true, id, status };
  }

  async getOnChainMarketForAdmin(id: string, _admin: AdminContext) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');
    if (!market.onChainId) throw new BadRequestException('Market is missing onChainId');

    const contractId =
      market.contractAddress ||
      this.config.get<string>(
        'STELLAR_CONTRACT_ID',
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      );

    const onChain = await this.getOnChainMarket(contractId, BigInt(market.onChainId));
    return {
      market_id: id,
      on_chain_id: market.onChainId,
      contract_id: contractId,
      market: onChain,
    };
  }

  async buildCreateMarketXdr(params: {
    adminWallet: string;
    marketId: bigint;
    lockAt: Date;
    feeNgoBps: number;
    feePlatformBps: number;
    feeGamificationBps: number;
    ngoCandidateIds: number[];
    oracleWallet?: string;
    assetContractId?: string;
  }): Promise<{ xdr: string; txHash: string; onChainId: string }> {
    const contractId = this.getContractId();
    const oracleWallet = params.oracleWallet ?? params.adminWallet;
    const assetContractId = params.assetContractId ?? this.getAssetContractId();

    const lockTs = BigInt(Math.floor(params.lockAt.getTime() / 1000));
    const adminAddr = this.parseAddress(params.adminWallet, 'admin wallet');
    const oracleAddr = this.parseAddress(oracleWallet, 'oracle wallet');
    const assetAddr = this.parseAddress(assetContractId, 'asset contract');
    const ngoCandidatesRaw = Array.isArray(params.ngoCandidateIds)
      ? params.ngoCandidateIds
      : [];
    if (ngoCandidatesRaw.length !== 3) {
      throw new BadRequestException('ngoCandidateIds must have exactly 3 NGO ids');
    }
    const ngoCandidates = ngoCandidatesRaw.map((n) => Number(n));
    if (ngoCandidates.some((n) => !Number.isInteger(n) || n <= 0)) {
      throw new BadRequestException('ngoCandidateIds must be positive integers');
    }
    if (new Set(ngoCandidates).size !== 3) {
      throw new BadRequestException('ngoCandidateIds must be unique');
    }
    const ngoCandidatesScVal = StellarSdk.xdr.ScVal.scvVec(
      ngoCandidates.map((id) => StellarSdk.nativeToScVal(id, { type: 'u32' })),
    );

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: this.parseAddress(contractId, 'contract').toScAddress(),
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
            ngoCandidatesScVal,
          ],
        }),
      ),
      auth: [],
    });

    const built = await this.buildSimulatedXdr(params.adminWallet, op);
    return { ...built, onChainId: params.marketId.toString() };
  }

  async buildAddNgoXdr(params: {
    adminWallet: string;
    ngoId: number;
    ngoWallet: string;
  }): Promise<{ xdr: string; txHash: string; onChainId: string }> {
    const contractId = this.getContractId();
    const adminAddr = this.parseAddress(params.adminWallet, 'admin wallet');
    const ngoAddr = this.parseAddress(params.ngoWallet, 'NGO wallet');

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: this.parseAddress(contractId, 'contract').toScAddress(),
          functionName: 'add_ngo',
          args: [
            StellarSdk.nativeToScVal(adminAddr),
            StellarSdk.nativeToScVal(params.ngoId, { type: 'u32' }),
            StellarSdk.nativeToScVal(ngoAddr),
          ],
        }),
      ),
      auth: [],
    });

    const built = await this.buildSimulatedXdr(params.adminWallet, op);
    return { ...built, onChainId: params.ngoId.toString() };
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
      ngoCandidateIds: dto.ngoCandidateIds ?? [],
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
    if (!market.onChainId) {
      throw new BadRequestException('Market is missing onChainId');
    }

    const contractId =
      market.contractAddress ||
      this.config.get<string>(
        'STELLAR_CONTRACT_ID',
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      );
    const marketIdU64 = BigInt(market.onChainId);
    const outcomeU32 = outcome === 'YES' ? 1 : 2;
    const oracleAddr = this.parseAddress(admin.wallet, 'admin/oracle wallet');

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            this.parseAddress(contractId, 'contract').toScAddress(),
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

    let built: { xdr: string; txHash: string };
    try {
      built = await this.buildSimulatedXdr(admin.wallet, op);
    } catch (e: any) {
      const code = this.extractContractErrorCode(e?.message ?? e);
      if (code === 6) {
        try {
          const onChain = await this.getOnChainMarket(contractId, marketIdU64);
          const statusRaw = onChain?.status;
          const status =
            typeof statusRaw === 'number'
              ? statusRaw
              : typeof statusRaw === 'bigint'
                ? Number(statusRaw)
                : null;

          const winningOutcome = onChain?.winning_outcome ?? onChain?.winningOutcome;
          const resolvedOutcome = this.marketOutcomeFromWinningOutcome(winningOutcome);

          if (status === 3 && resolvedOutcome) {
            await this.marketRepo.update(
              { id },
              { status: 'resolved', outcome: resolvedOutcome as any },
            );
            throw new BadRequestException(
              `Esse market já está resolvido on-chain (${resolvedOutcome}). Status local atualizado.`,
            );
          }

          if (status === 2) {
            throw new BadRequestException(
              'Esse market está cancelado on-chain. Não é possível resolver novamente.',
            );
          }

          if (status === 1) {
            throw new BadRequestException(
              'Esse market está LOCKED on-chain e o contrato atual está recusando a resolução (MarketClosed). Precisa ajustar o smart contract para aceitar LOCKED na função resolve_market.',
            );
          }
        } catch (inner: any) {
          if (inner instanceof BadRequestException) throw inner;
        }
      }
      throw e;
    }
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
    if (!market.onChainId) throw new BadRequestException('Market is missing onChainId');

    const contractId =
      market.contractAddress ||
      this.config.get<string>(
        'STELLAR_CONTRACT_ID',
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      );
    const marketIdU64 = BigInt(market.onChainId);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            this.parseAddress(contractId, 'contract').toScAddress(),
          functionName: 'cancel_market',
          args: [StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' })],
        }),
      ),
      auth: [],
    });

    const built = await this.buildSimulatedXdr(admin.wallet, op);
    const xdr = built.xdr;

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

    return { xdr, txHash: built.txHash, action: 'CANCEL_MARKET' };
  }

  async distributeImpact(id: string, admin: AdminContext) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');
    if (!market.onChainId) throw new BadRequestException('Market is missing onChainId');

    const contractId =
      market.contractAddress ||
      this.config.get<string>(
        'STELLAR_CONTRACT_ID',
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      );
    const marketIdU64 = BigInt(market.onChainId);
    const adminAddr = this.parseAddress(admin.wallet, 'admin wallet');

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            this.parseAddress(contractId, 'contract').toScAddress(),
          functionName: 'distribute_impact_funds',
          args: [
            StellarSdk.nativeToScVal(adminAddr),
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
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

    return { xdr, txHash: built.txHash, action: 'DISTRIBUTE_IMPACT' };
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
