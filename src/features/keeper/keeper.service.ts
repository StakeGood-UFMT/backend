import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { MarketEntity } from '../../database/entities/market.entity';
import * as StellarSdk from '@stellar/stellar-sdk';

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
    } catch (error) {
      this.logger.error(`Erro ao executar job de Keeper: ${error.message}`, error.stack);
    }
  }

  private async submitBatchBump(marketIds: bigint[]) {
    const horizonUrl = this.config.get<string>('STELLAR_HORIZON_URL', 'https://horizon-testnet.stellar.org');
    const networkPassphrase = this.config.get<string>('STELLAR_NETWORK_PASSPHRASE', StellarSdk.Networks.TESTNET);
    const contractId = this.config.get<string>('STELLAR_CONTRACT_ID');
    const keeperSecret = this.config.get<string>('STELLAR_KEEPER_SECRET');

    if (!keeperSecret) {
      throw new Error('STELLAR_KEEPER_SECRET não configurado.');
    }

    if (!contractId) {
      throw new Error('STELLAR_CONTRACT_ID não configurado.');
    }

    const keeperKeypair = StellarSdk.Keypair.fromSecret(keeperSecret);
    const server = new StellarSdk.Horizon.Server(horizonUrl);

    // Build the operation
    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'batch_bump_ttl',
          args: [
            StellarSdk.nativeToScVal(marketIds.map(id => StellarSdk.nativeToScVal(id, { type: 'u64' }))),
          ],
        }),
      ),
      auth: [],
    });

    // Get account info for sequence number
    const account = await server.loadAccount(keeperKeypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '10000',
      networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    tx.sign(keeperKeypair);

    const result = await server.submitTransaction(tx);
    this.logger.log(`Transação enviada: ${result.hash}`);
  }
}
