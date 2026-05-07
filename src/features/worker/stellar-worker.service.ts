import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProcessedTransactionEntity } from '../../database/entities/processed-transaction.entity';
import { WorkerCursorEntity } from '../../database/entities/worker-cursor.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { MarketEntity } from '../../database/entities/market.entity';
import { ImpactLedgerEntryEntity } from '../../database/entities/impact-ledger-entry.entity';
import { TxReceiptEntity } from '../../database/entities/tx-receipt.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { StakeGoodGateway } from '../websocket/stakegood.gateway';
import { NotificationService } from '../notifications/notification.service';
import * as StellarSdk from '@stellar/stellar-sdk';

const CURSOR_KEY = 'default';
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 60_000;

export interface HorizonEvent {
  id: string;
  type: string;
  topic: string[];
  value: unknown;
  ledger: number;
  txHash: string;
  opIndex: number;
}

interface ParsedNgoRegistered {
  kind: 'NGO:Registered';
  walletAddress: string;
  name: string;
}

interface ParsedNgoDeactivated {
  kind: 'NGO:Deactivated';
  walletAddress: string;
}

interface ParsedMarketCreated {
  kind: 'Market:Created';
  marketId: string;
  title: string;
  lockAt: Date;
  resolveAt: Date;
  createdBy: string;
}

interface ParsedMarketResolved {
  kind: 'Market:Resolved';
  marketId: string;
  outcome: string;
}

interface ParsedImpactDistributed {
  kind: 'Impact:Distributed';
  marketId: string;
  ngoId: string;
  amount: string;
}

type ParsedEvent =
  | ParsedNgoRegistered
  | ParsedNgoDeactivated
  | ParsedMarketCreated
  | ParsedMarketResolved
  | ParsedImpactDistributed;

@Injectable()
export class StellarWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StellarWorkerService.name);
  private running = false;
  private reconnectAttempt = 0;

  constructor(
    @InjectRepository(ProcessedTransactionEntity)
    private readonly processedTxRepo: Repository<ProcessedTransactionEntity>,
    @InjectRepository(WorkerCursorEntity)
    private readonly cursorRepo: Repository<WorkerCursorEntity>,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
    private readonly gateway: StakeGoodGateway,
    private readonly notificationService: NotificationService,
  ) {}

  onModuleInit() {
    if (this.config.get('NODE_ENV') !== 'test') {
      this.running = true;
      this.startStream();
    }
  }

  onModuleDestroy() {
    this.running = false;
  }

  private async startStream(): Promise<void> {
    const cursor = Number(await this.loadCursor());
    const rpcUrl = this.config.get<string>(
      'STELLAR_RPC_URL',
      'https://soroban-testnet.stellar.org',
    );
    const contractId = this.config.get<string>('STELLAR_CONTRACT_ID', '');

    if (!contractId) {
      this.logger.warn('STELLAR_CONTRACT_ID não configurado; worker desativado.');
      return;
    }

    const rpc = new StellarSdk.rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith('http://'),
    });

    let lastLedger = Number.isFinite(cursor) ? cursor : 0;
    if (lastLedger < 0) lastLedger = 0;

    this.logger.log(
      `Worker conectando ao Stellar RPC (startLedger=${lastLedger}, contract=${contractId})`,
    );

    while (this.running) {
      try {
        const latest = await rpc.getLatestLedger();
        const endLedger = latest.sequence;
        if (endLedger < 1) {
          await this.sleep(1000);
          continue;
        }
        if (lastLedger === 0 || lastLedger > endLedger) {
          lastLedger = endLedger;
        }
        const startLedger = Math.min(lastLedger, endLedger);

        const response = await rpc.getEvents({
          filters: [{ type: 'contract', contractIds: [contractId] }],
          startLedger,
          endLedger,
          limit: 200,
        });

        this.reconnectAttempt = 0;

        for (const ev of response.events) {
          const normalized = this.normalizeRpcEvent(ev);
          const parsed = this.parseContractEvent(normalized);
          if (!parsed) continue;

          const alreadyProcessed = await this.isAlreadyProcessed(
            normalized.txHash,
            normalized.opIndex,
          );
          if (alreadyProcessed) continue;

          await this.persistAtomically(parsed, normalized);
        }

        lastLedger = endLedger;
        await this.sleep(1000);
      } catch (err: any) {
        if (!this.running) return;
        const msg = err instanceof Error ? err.message : String(err);
        const rangeMatch =
          /ledger range:\s*(\d+)\s*-\s*(\d+)/i.exec(msg) ?? null;
        if (rangeMatch) {
          lastLedger = Number(rangeMatch[2]);
        }
        const delay = Math.min(
          BASE_DELAY_MS * 2 ** this.reconnectAttempt,
          MAX_DELAY_MS,
        );
        this.reconnectAttempt++;
        this.logger.warn(
          `Erro no stream RPC (tentativa ${this.reconnectAttempt}), reconectando em ${delay}ms: ${err.message}`,
        );
        await this.sleep(delay);
      }
    }
  }

  private normalizeRpcEvent(ev: any): HorizonEvent {
    const topicNative = Array.isArray(ev.topic)
      ? ev.topic.map((t: any) => StellarSdk.scValToNative(t))
      : [];

    const topic = topicNative.map((t: any) => String(t));

    const valueNative = ev.value ? StellarSdk.scValToNative(ev.value) : {};
    const value =
      valueNative instanceof Map
        ? Object.fromEntries(
            Array.from(valueNative.entries()).map(([k, v]) => [String(k), v]),
          )
        : valueNative;

    return {
      id: String(ev.id ?? ''),
      type: String(ev.type ?? ''),
      topic,
      value,
      ledger: Number(ev.ledger ?? 0),
      txHash: String(ev.txHash ?? ''),
      opIndex: Number(ev.operationIndex ?? 0),
    };
  }

  private parseContractEvent(event: HorizonEvent): ParsedEvent | null {
    // topic[0] = namespace ("NGO" | "Market"), topic[1] = action
    // O Horizon retorna ScVal serializado; aqui assumimos que o contrato V3
    // emite topics como strings decodificáveis diretamente (ScSymbol → string).
    // Em produção substituir pelo decode XDR via @stellar/stellar-base.
    const [namespace, action] = event.topic ?? [];

    if (!namespace || !action) return null;

    let body: Record<string, any> = {};
    try {
      body =
        typeof event.value === 'string' ? JSON.parse(event.value) : event.value;
    } catch {
      return null;
    }

    if (namespace === 'NGO' && action === 'Registered') {
      return {
        kind: 'NGO:Registered',
        walletAddress: body.wallet_address ?? '',
        name: body.name ?? '',
      };
    }

    if (namespace === 'NGO' && action === 'Deactivated') {
      return {
        kind: 'NGO:Deactivated',
        walletAddress: body.wallet_address ?? '',
      };
    }

    if (namespace === 'Market' && action === 'Created') {
      return {
        kind: 'Market:Created',
        marketId: body.market_id ?? '',
        title: body.title ?? '',
        lockAt: body.lock_at ? new Date(body.lock_at) : new Date(),
        resolveAt: body.resolve_at ? new Date(body.resolve_at) : new Date(),
        createdBy: body.created_by ?? '',
      };
    }

    if (namespace === 'Market' && action === 'Resolved') {
      return {
        kind: 'Market:Resolved',
        marketId: body.market_id ?? '',
        outcome: body.outcome === 1 ? 'YES' : 'NO',
      };
    }

    if (namespace === 'Impact' && action === 'Distributed') {
      return {
        kind: 'Impact:Distributed',
        marketId: body.market_id ?? '',
        ngoId: body.ngo_id ?? '',
        amount: body.amount ?? '0',
      };
    }

    return null;
  }

  private async persistAtomically(
    parsed: ParsedEvent,
    event: HorizonEvent,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      switch (parsed.kind) {
        case 'NGO:Registered':
          await manager.upsert(
            NgoEntity,
            {
              walletAddress: parsed.walletAddress,
              name: parsed.name,
              slug: parsed.walletAddress,
              verified: false,
              social: {},
              impactMetrics: {},
            },
            ['walletAddress'],
          );
          break;

        case 'NGO:Deactivated':
          await manager.update(
            NgoEntity,
            { walletAddress: parsed.walletAddress },
            { verified: false },
          );
          break;

        case 'Market:Created':
          await manager.upsert(
            MarketEntity,
            {
              title: parsed.title,
              onChainId: parsed.marketId,
              status: 'active', // Set to active when created on-chain
              lockAt: parsed.lockAt,
              resolveAt: parsed.resolveAt,
              createdBy: parsed.createdBy,
            },
            ['id'],
          );

          // Notify creator
          const creator = await manager.findOne(UserEntity, {
            where: { primaryWallet: parsed.createdBy },
          });
          if (creator) {
            await this.notificationService.createNotification(
              creator.id,
              `Your market "${parsed.title}" has been successfully created!`,
              'market_created',
            );
          }
          break;

        case 'Market:Resolved':
          const resolvedMarket = await manager.findOne(MarketEntity, {
            where: { id: parsed.marketId },
          });
          const title = resolvedMarket?.title || parsed.marketId;

          await manager.update(
            MarketEntity,
            { id: parsed.marketId },
            {
              status: 'resolved',
              outcome: parsed.outcome as any,
            },
          );
          this.gateway.emitMarketResolved(parsed.marketId, {
            outcome: parsed.outcome,
          });

          {
            const feeNgo = Number(resolvedMarket?.feeNgo ?? 0);
            const feePlatform = Number(resolvedMarket?.feePlatform ?? 0);
            const feeGamification = Number(resolvedMarket?.feeGamification ?? 0);
            const totalFeePct = Math.max(0, feeNgo + feePlatform + feeGamification);

            const allPositions = await manager.find(UserPositionEntity, {
              where: { marketId: parsed.marketId },
            });

            const positionsForPayout = allPositions.filter(
              (p) => p.status !== 'cancelled' && p.status !== 'claimed',
            );

            const yesPool = positionsForPayout
              .filter((p) => p.outcome === 'YES')
              .reduce((sum, p) => sum + Number(p.amountStaked), 0);
            const noPool = positionsForPayout
              .filter((p) => p.outcome === 'NO')
              .reduce((sum, p) => sum + Number(p.amountStaked), 0);

            const winningPool = parsed.outcome === 'YES' ? yesPool : noPool;
            const losingPool = parsed.outcome === 'YES' ? noPool : yesPool;
            const totalFeeAmount = losingPool * totalFeePct;
            const netLosingPool = Math.max(0, losingPool - totalFeeAmount);

            const resolvedAt = new Date();
            const updates = positionsForPayout.map((p) => {
              const invested = Number(p.amountStaked);
              const profit =
                p.outcome === parsed.outcome && winningPool > 0
                  ? (netLosingPool * invested) / winningPool
                  : 0;
              const payout = p.outcome === parsed.outcome ? invested + profit : 0;
              return manager.save(UserPositionEntity, {
                ...p,
                status: 'resolved',
                resolvedAt,
                payoutAmount: Number(payout.toFixed(8)),
              });
            });

            if (updates.length) {
              await Promise.all(updates);
            }
          }

          // Notify participants
          const positions = await manager.find(UserPositionEntity, {
            where: { marketId: parsed.marketId },
          });

          for (const pos of positions) {
            const isWinner = pos.outcome === parsed.outcome;
            const message = isWinner
              ? `Congratulations! You won on market "${title}".`
              : `The market "${title}" has been resolved. You lost your stake.`;

            await this.notificationService.createNotification(
              pos.userId,
              message,
              isWinner ? 'profit_credited' : 'market_resolved',
            );
          }
          break;

        case 'Impact:Distributed':
          await manager.save(ImpactLedgerEntryEntity, {
            marketId: parsed.marketId,
            ngoId: parsed.ngoId,
            amount: parseFloat(parsed.amount) / 10000000, // Stroops to USDC
            date: new Date(),
            source: 'fee_pool',
            txHash: event.txHash,
          });
          // Assuming gateway has this method or similar
          this.gateway.server.emit('impact_distributed', {
            marketId: parsed.marketId,
            ngoId: parsed.ngoId,
            amount: parsed.amount,
          });
          break;
      }

      await manager.insert(ProcessedTransactionEntity, {
        txHash: event.txHash,
        opIndex: event.opIndex,
        eventType: parsed.kind,
      });

      await manager.insert(TxReceiptEntity, {
        txHash: event.txHash,
        ledger: event.ledger,
        status: 'success',
        processedAt: new Date(),
      });

      await manager.upsert(
        WorkerCursorEntity,
        {
          id: CURSOR_KEY,
          lastLedgerId: String(event.ledger),
        },
        ['id'],
      );
    });

    this.logger.log(
      `Evento processado: ${parsed.kind} (ledger=${event.ledger})`,
    );
  }

  async isAlreadyProcessed(txHash: string, opIndex: number): Promise<boolean> {
    const count = await this.processedTxRepo.countBy({ txHash, opIndex });
    return count > 0;
  }

  private async loadCursor(): Promise<string> {
    const cursor = await this.cursorRepo.findOne({ where: { id: CURSOR_KEY } });
    return cursor?.lastLedgerId ?? '0';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
