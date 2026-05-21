import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { MarketEntity } from '../../database/entities/market.entity';
import * as StellarSdk from '@stellar/stellar-sdk';

export interface AdminMarketTTLDto {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  image_url?: string;
  total_liquidity: string;
  lock_at: string;
  settle_at?: string;
  created_at: string;
  resolution_rule: string;
  resolution_source: string;
  oracle_url?: string;
  contract_address?: string;
  fee_ngo: number;
  fee_platform: number;
  fee_gamification: number;
  ttl_ledger_expiry?: number;
  is_eligible_for_bump: boolean;
}

@Injectable()
export class KeeperService {
  private readonly logger = new Logger(KeeperService.name);

  constructor(
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>,
    private readonly config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleBatchBumpTTL() {
    this.logger.log('Iniciando job diário de Keeper: batch bump TTL');

    try {
      // 1. Selecionar mercados ativos (OPEN ou LOCKED no SC)
      // No DB, 'active' mapeia para OPEN e 'locked' para LOCKED.
      const activeMarkets = await this.marketRepo.find({
        where: {
          status: In(['active', 'locked']),
        },
        select: ['onChainId'],
      });

      const marketIds = activeMarkets
        .filter((m): m is MarketEntity & { onChainId: string } => !!m.onChainId)
        .map((m) => BigInt(m.onChainId));

      if (marketIds.length === 0) {
        this.logger.log('Nenhum mercado ativo encontrado para bump de TTL.');
        return;
      }

      this.logger.log(`Processando bump para ${marketIds.length} mercados.`);

      // 2. Chamar o contrato Soroban
      await this.submitBatchBump(marketIds);

      this.logger.log('Job de Keeper finalizado com sucesso.');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Erro ao executar job de Keeper: ${msg}`, stack);
    }
  }

  async getEligibleMarkets(): Promise<{
    markets: AdminMarketTTLDto[];
    contract_ttl?: number;
    latest_ledger: number;
  }> {
    const markets = await this.marketRepo.find({
      where: {
        status: In(['active', 'locked']),
      },
      order: {
        lockAt: 'ASC',
      },
    });

    const rpcUrl = this.config.get<string>(
      'STELLAR_RPC_URL',
      'https://soroban-testnet.stellar.org',
    );
    const contractId = this.config.get<string>('STELLAR_CONTRACT_ID', '');
    const threshold = Number(
      this.config.get<string>('KEEPER_TTL_THRESHOLD_LEDGERS', '50000'),
    );

    if (!contractId) {
      return {
        markets: markets.map((m) => this.toAdminMarketTtl(m, undefined, false)),
        contract_ttl: undefined,
        latest_ledger: 0,
      };
    }

    const rpc = new StellarSdk.rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith('http://'),
    });

    let latestLedgerSeq = 0;
    try {
      const latest = await rpc.getLatestLedger();
      latestLedgerSeq = latest.sequence;
    } catch (e: any) {
      this.logger.warn(
        `Failed to load latest ledger from RPC; TTL will be omitted: ${e?.message ?? e}`,
      );
      return {
        markets: markets.map((m) => this.toAdminMarketTtl(m, undefined, false)),
        contract_ttl: undefined,
        latest_ledger: 0,
      };
    }

    const keysByXdr = new Map<string, MarketEntity[]>();
    const ledgerKeys: any[] = [];
    const seenXdr = new Set<string>();

    // Add contract instance footprint to get global contract TTL
    let contractFootprintXdr: string | undefined = undefined;
    try {
      const contractFootprint = new StellarSdk.Contract(contractId).getFootprint();
      contractFootprintXdr = contractFootprint.toXDR('base64');
      ledgerKeys.push(contractFootprint);
      seenXdr.add(contractFootprintXdr);
    } catch (err: any) {
      this.logger.warn(`Failed to build contract footprint: ${err?.message ?? err}`);
    }

    for (const market of markets) {
      if (!market.onChainId) continue;
      let u64: bigint;
      try {
        u64 = BigInt(market.onChainId);
      } catch {
        continue;
      }

      const cId = market.contractAddress || contractId;
      if (!cId) continue;

      let scAddress: StellarSdk.xdr.ScAddress;
      try {
        scAddress = StellarSdk.Address.fromString(cId).toScAddress();
      } catch {
        continue;
      }

      const storageKey = StellarSdk.xdr.ScVal.scvVec([
        StellarSdk.nativeToScVal('MarketId', { type: 'symbol' }),
        StellarSdk.nativeToScVal(u64, { type: 'u64' }),
      ]);

      const ledgerKey = StellarSdk.xdr.LedgerKey.contractData(
        new StellarSdk.xdr.LedgerKeyContractData({
          contract: scAddress,
          key: storageKey,
          durability: StellarSdk.xdr.ContractDataDurability.persistent(),
        }),
      );

      const keyXdr = ledgerKey.toXDR('base64');
      if (!seenXdr.has(keyXdr)) {
        seenXdr.add(keyXdr);
        ledgerKeys.push(ledgerKey);
      }

      const existing = keysByXdr.get(keyXdr) ?? [];
      existing.push(market);
      keysByXdr.set(keyXdr, existing);
    }

    let contractTtl: number | undefined = undefined;
    let ttlByMarketId = new Map<string, number>();

    if (ledgerKeys.length) {
      try {
        const resp = await rpc.getLedgerEntries(...ledgerKeys);
        this.logger.log(`getLedgerEntries retornou ${resp?.entries?.length ?? 0} entradas para ${ledgerKeys.length} chaves solicitadas.`);

        for (const entry of resp.entries ?? []) {
          const keyXdr = entry.key.toXDR('base64');
          const liveUntil = entry.liveUntilLedgerSeq != null ? Number(entry.liveUntilLedgerSeq) : undefined;

          if (liveUntil == null || isNaN(liveUntil)) {
            this.logger.warn(`Entrada sem liveUntilLedgerSeq válido para a chave: ${keyXdr}`);
            continue;
          }

          const remaining = Math.max(0, liveUntil - latestLedgerSeq);

          if (contractFootprintXdr && keyXdr === contractFootprintXdr) {
            contractTtl = remaining;
            this.logger.log(`TTL do contrato global calculado: ${contractTtl} ledgers restantes.`);
            continue;
          }

          const matchedMarkets = keysByXdr.get(keyXdr);
          if (matchedMarkets) {
            for (const market of matchedMarkets) {
              ttlByMarketId.set(market.id, remaining);
            }
          } else {
            this.logger.warn(`Chave XDR retornada não corresponde a nenhum mercado mapeado: ${keyXdr}`);
          }
        }
      } catch (e: any) {
        this.logger.warn(
          `Failed to fetch ledger entries for TTL; TTL will be omitted: ${e?.message ?? e}`,
        );
      }
    }

    const marketsDto = markets.map((m) => {
      const ttl = ttlByMarketId.get(m.id);
      const eligible =
        typeof ttl === 'number' ? ttl <= threshold : false;
      return this.toAdminMarketTtl(m, ttl, eligible);
    });

    return {
      markets: marketsDto,
      contract_ttl: contractTtl,
      latest_ledger: latestLedgerSeq,
    };
  }

  private toAdminMarketTtl(
    m: MarketEntity,
    ttlLedgerExpiry: number | undefined,
    eligible: boolean,
  ): AdminMarketTTLDto {
    return {
      id: m.id,
      title: m.title,
      description: m.description ?? '',
      category: (m.category ?? 'ALL') as any,
      status: m.status as any,
      image_url: m.imageUrl ?? undefined,
      total_liquidity: '0',
      lock_at: m.lockAt instanceof Date ? m.lockAt.toISOString() : (m.lockAt as any),
      settle_at:
        m.resolveAt instanceof Date ? m.resolveAt.toISOString() : (m.resolveAt as any),
      created_at:
        m.createdAt instanceof Date ? m.createdAt.toISOString() : (m.createdAt as any),
      resolution_rule: m.resolutionRule ?? '',
      resolution_source: m.resolutionSource ?? '',
      oracle_url: m.oracleUrl ?? undefined,
      contract_address: m.contractAddress ?? undefined,
      fee_ngo: Number(m.feeNgo ?? 0),
      fee_platform: Number(m.feePlatform ?? 0),
      fee_gamification: Number(m.feeGamification ?? 0),
      ttl_ledger_expiry: ttlLedgerExpiry,
      is_eligible_for_bump: eligible,
    };
  }

  async batchBumpTTL(marketIds: string[]): Promise<{ hash: string }> {
    if (!marketIds || marketIds.length === 0) {
      throw new Error('Nenhum ID de mercado fornecido para bump.');
    }

    const bigIntIds = marketIds.map((id) => {
      // Find the market to get its onChainId
      return this.marketRepo
        .findOne({ where: { id }, select: ['onChainId'] })
        .then((m) => {
          if (!m || !m.onChainId) {
            throw new Error(`Mercado ${id} não possui onChainId.`);
          }
          return BigInt(m.onChainId);
        });
    });

    const resolvedIds = await Promise.all(bigIntIds);
    const hash = await this.submitBatchBump(resolvedIds);
    return { hash };
  }

  private async submitBatchBump(marketIds: bigint[]): Promise<string> {
    const horizonUrl = this.config.get<string>(
      'STELLAR_HORIZON_URL',
      'https://horizon-testnet.stellar.org',
    );
    const rpcUrl = this.config.get<string>(
      'STELLAR_RPC_URL',
      'https://soroban-testnet.stellar.org',
    );
    const networkPassphrase = this.config.get<string>(
      'STELLAR_NETWORK_PASSPHRASE',
      StellarSdk.Networks.TESTNET,
    );
    const contractId = this.config.get<string>('STELLAR_CONTRACT_ID');
    const keeperSecret = this.config.get<string>('STELLAR_KEEPER_SECRET');

    if (!keeperSecret) {
      throw new Error('STELLAR_KEEPER_SECRET não configurado.');
    }

    if (!contractId) {
      throw new Error('STELLAR_CONTRACT_ID não configurado.');
    }

    const keeperKeypair = StellarSdk.Keypair.fromSecret(keeperSecret);
    const horizon = new StellarSdk.Horizon.Server(horizonUrl);
    const rpc = new StellarSdk.rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith('http://'),
    });

    // Build the operation — Vec<u64> must be encoded as scvVec of u64 ScVals
    const idsScVal = StellarSdk.xdr.ScVal.scvVec(
      marketIds.map((id) => StellarSdk.nativeToScVal(id, { type: 'u64' })),
    );

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress:
            StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'batch_bump_ttl',
          args: [idsScVal],
        }),
      ),
      auth: [],
    });

    // Get account info for sequence number via Horizon
    let account: StellarSdk.Horizon.AccountResponse;
    try {
      account = await horizon.loadAccount(keeperKeypair.publicKey());
    } catch (error: any) {
      if (error.name === 'NotFoundError' || error.response?.status === 404) {
        throw new Error(
          `Stellar keeper account not found: ${keeperKeypair.publicKey()}. Please ensure the keeper wallet is funded with XLM.`,
        );
      }
      throw error;
    }

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '10000',
      networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    // Soroban contract calls require simulation to obtain footprint + auth entries
    const sim = await rpc.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationError(sim)) {
      throw new Error(`Simulação falhou: ${sim.error}`);
    }
    if (!StellarSdk.rpc.Api.isSimulationSuccess(sim)) {
      throw new Error('Simulação não retornou sucesso.');
    }

    // assembleTransaction injects the footprint and resource fees
    const assembled = StellarSdk.rpc.assembleTransaction(tx, sim).build();
    assembled.sign(keeperKeypair);

    // Submit via Soroban RPC, not Horizon
    const sendResp = await rpc.sendTransaction(assembled);
    if (sendResp.status === 'ERROR') {
      throw new Error(`Envio da transação falhou: ${sendResp.errorResult?.toXDR('base64') ?? 'unknown error'}`);
    }

    this.logger.log(`Transação enviada: ${sendResp.hash} (status: ${sendResp.status})`);

    // Poll until the transaction is confirmed (SUCCESS or FAILED).
    // A Soroban tx is only applied to the ledger state once confirmed — not on PENDING/DUPLICATE.
    // Without this, the frontend reloads TTL data before the bump takes effect.
    const hash = sendResp.hash;
    const maxAttempts = 30;
    const pollIntervalMs = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      try {
        const txStatus = await rpc.getTransaction(hash);
        if (txStatus.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
          this.logger.log(`Transação confirmada com sucesso: ${hash}`);
          return hash;
        }
        if (txStatus.status === StellarSdk.rpc.Api.GetTransactionStatus.FAILED) {
          throw new Error(`Transação falhou na rede: ${hash}`);
        }
        // NOT_FOUND or still pending — continue polling
        this.logger.debug(`Aguardando confirmação da transação ${hash} (tentativa ${attempt + 1}/${maxAttempts})...`);
      } catch (e: any) {
        if (e?.message?.startsWith('Transação falhou')) throw e;
        this.logger.warn(`Erro ao verificar status da transação: ${e?.message ?? e}`);
      }
    }

    throw new Error(`Timeout aguardando confirmação da transação: ${hash}`);
  }
}
