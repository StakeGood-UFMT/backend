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
  ngoId: string;
  walletAddress: string;
  name?: string;
}

interface ParsedNgoDeactivated {
  kind: 'NGO:Deactivated';
  ngoId: string;
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

interface ParsedRewardClaimed {
  kind: 'Reward:Claimed';
  marketId: string;
  userWallet: string;
  amount: string;
}

interface ParsedMarketLocked {
  kind: 'Market:Locked';
  marketId: string;
}

interface ParsedMarketCanceled {
  kind: 'Market:Canceled';
  marketId: string;
}

type ParsedEvent =
  | ParsedNgoRegistered
  | ParsedNgoDeactivated
  | ParsedMarketCreated
  | ParsedMarketResolved
  | ParsedImpactDistributed
  | ParsedRewardClaimed
  | ParsedMarketLocked
  | ParsedMarketCanceled;

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

    const toBigintLikeString = (value: unknown): string | null => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'bigint') return value.toString();
      if (typeof value === 'number' && Number.isFinite(value))
        return Math.trunc(value).toString();
      if (typeof value === 'string') {
        const s = value.trim();
        return s ? s : null;
      }
      return null;
    };

    const toNumberLike = (value: unknown): number | null => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'bigint') return Number(value);
      if (typeof value === 'string' && value.trim()) {
        const n = Number(value);
        return Number.isFinite(n) ? n : null;
      }
      return null;
    };

    const asTuple = (value: unknown): unknown[] | null =>
      Array.isArray(value) ? value : null;

    let body: any = {};
    try {
      body =
        typeof event.value === 'string' ? JSON.parse(event.value) : event.value;
    } catch {
      return null;
    }

    if (namespace === 'NGO' && action === 'Registered') {
      const tuple = asTuple(body);
      const ngoId =
        toBigintLikeString(tuple?.[0]) ??
        toBigintLikeString(body?.ngo_id) ??
        toBigintLikeString(body?.ngoId) ??
        null;

      const walletValue = tuple?.[1] ?? body?.wallet_address ?? body?.walletAddress ?? body?.wallet;
      const walletAddress =
        typeof walletValue === 'string'
          ? walletValue.trim()
          : walletValue !== undefined && walletValue !== null
            ? String(walletValue)
            : '';
      if (!walletAddress) return null;

      const nameRaw = body?.name ?? body?.ngo_name ?? body?.ngoName ?? null;
      const name = typeof nameRaw === 'string' && nameRaw.trim() ? nameRaw.trim() : undefined;

      return {
        kind: 'NGO:Registered',
        ngoId: ngoId ?? '0',
        walletAddress,
        name,
      };
    }

    if (namespace === 'NGO' && action === 'Deactivated') {
      const tuple = asTuple(body);
      const ngoId =
        toBigintLikeString(tuple?.[0]) ??
        toBigintLikeString(body?.ngo_id) ??
        toBigintLikeString(body?.ngoId) ??
        toBigintLikeString(body) ??
        null;
      if (!ngoId) return null;

      return { kind: 'NGO:Deactivated', ngoId };
    }

    if (namespace === 'Market' && action === 'Resolved') {
      const tuple = asTuple(body);
      const marketId =
        toBigintLikeString(tuple?.[0]) ??
        toBigintLikeString(body?.market_id) ??
        toBigintLikeString(body?.marketId) ??
        toBigintLikeString(body?.id) ??
        toBigintLikeString(body) ??
        null;

      if (!marketId) return null;

      const outcomeRaw =
        toNumberLike(tuple?.[1]) ??
        toNumberLike(body?.winning_outcome) ??
        toNumberLike(body?.outcome) ??
        null;
      if (outcomeRaw === null) return null;

      return {
        kind: 'Market:Resolved',
        marketId,
        outcome: outcomeRaw === 1 ? 'YES' : 'NO',
      };
    }

    if (namespace === 'Market' && action === 'Locked') {
      const marketId =
        toBigintLikeString(asTuple(body)?.[0]) ?? toBigintLikeString(body) ?? null;
      if (!marketId) return null;
      return { kind: 'Market:Locked', marketId };
    }

    if (namespace === 'Market' && action === 'Canceled') {
      const marketId =
        toBigintLikeString(asTuple(body)?.[0]) ?? toBigintLikeString(body) ?? null;
      if (!marketId) return null;
      return { kind: 'Market:Canceled', marketId };
    }

    if (namespace === 'Market' && action === 'Created') {
      const tuple = asTuple(body);
      const marketId =
        toBigintLikeString(tuple?.[0]) ??
        toBigintLikeString(body?.market_id) ??
        toBigintLikeString(body?.marketId) ??
        toBigintLikeString(body?.id) ??
        toBigintLikeString(body) ??
        null;

      if (!marketId) return null;

      const title =
        (typeof body?.title === 'string' && body.title.trim()
          ? body.title.trim()
          : undefined) ?? `Market ${marketId}`;

      const lockAtRaw = body?.lock_at ?? body?.lockAt ?? null;
      const resolveAtRaw = body?.resolve_at ?? body?.resolveAt ?? null;
      const lockAt = lockAtRaw ? new Date(String(lockAtRaw)) : new Date(0);
      const resolveAt = resolveAtRaw ? new Date(String(resolveAtRaw)) : new Date(0);

      const createdBy =
        (typeof body?.created_by === 'string' && body.created_by.trim()
          ? body.created_by.trim()
          : typeof body?.createdBy === 'string' && body.createdBy.trim()
            ? body.createdBy.trim()
            : '') || '';

      return {
        kind: 'Market:Created',
        marketId,
        title,
        lockAt,
        resolveAt,
        createdBy,
      };
    }
    if (namespace === 'Impact' && action === 'Distributed') {
      const tuple = asTuple(body);
      const marketId =
        toBigintLikeString(tuple?.[0]) ??
        toBigintLikeString(body?.market_id) ??
        toBigintLikeString(body?.marketId) ??
        null;
      if (!marketId) return null;

      const ngoId =
        toBigintLikeString(tuple?.[1]) ??
        toBigintLikeString(body?.ngo_id) ??
        toBigintLikeString(body?.winner_ngo_id) ??
        null;
      if (!ngoId) return null;

      const amount =
        toBigintLikeString(tuple?.[2]) ??
        toBigintLikeString(body?.amount) ??
        toBigintLikeString(body?.total_amount) ??
        '0';

      return {
        kind: 'Impact:Distributed',
        marketId,
        ngoId,
        amount,
      };
    }

    if (namespace === 'Reward' && action === 'Claimed') {
      const tuple = asTuple(body);
      const marketId =
        toBigintLikeString(tuple?.[0]) ??
        toBigintLikeString(body?.market_id) ??
        toBigintLikeString(body?.marketId) ??
        null;
      if (!marketId) return null;

      const userWallet =
        String(tuple?.[1] ?? '') ||
        String(body?.user ?? '') ||
        String(body?.user_wallet ?? '') ||
        '';
      if (!userWallet) return null;

      const amount =
        toBigintLikeString(tuple?.[2]) ??
        toBigintLikeString(body?.amount) ??
        '0';

      return {
        kind: 'Reward:Claimed',
        marketId,
        userWallet,
        amount,
      };
    }

    if (namespace === 'Market') {
      return null;
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
          {
            const onChainId = Number(parsed.ngoId);
            const onChainIdSafe = Number.isFinite(onChainId) ? onChainId : undefined;

            const existing = await manager.findOne(NgoEntity, {
              where: onChainIdSafe !== undefined ? { onChainId: onChainIdSafe } : { walletAddress: parsed.walletAddress },
            });

            if (existing) {
              existing.walletAddress = parsed.walletAddress;
              if (onChainIdSafe !== undefined) existing.onChainId = onChainIdSafe;
              if (parsed.name) existing.name = parsed.name;
              if (!existing.slug) existing.slug = this.generateSlug(existing.name, onChainIdSafe ?? 0);
              if (!existing.social) existing.social = {};
              if (!existing.impactMetrics) existing.impactMetrics = {};
              await manager.save(NgoEntity, existing);
            } else {
              await manager.save(
                NgoEntity,
                manager.create(NgoEntity, {
                  onChainId: onChainIdSafe,
                  walletAddress: parsed.walletAddress,
                  name: parsed.name ?? `NGO ${parsed.ngoId}`,
                  slug: this.generateSlug(parsed.name ?? `NGO ${parsed.ngoId}`, onChainIdSafe ?? 0),
                  verified: false,
                  social: {},
                  impactMetrics: {},
                }),
              );
            }
          }
          break;

        case 'NGO:Deactivated':
          {
            const onChainId = Number(parsed.ngoId);
            if (Number.isFinite(onChainId)) {
              await manager.update(
                NgoEntity,
                { onChainId },
                { verified: false },
              );
            }
          }
          break;

        case 'Market:Created':
          {
            const existingMarket = await manager.findOne(MarketEntity, {
              where: { onChainId: parsed.marketId },
            });

            if (existingMarket) {
              // If market already exists (created by proposal approval), just ensure it's marked as active
              await manager.update(
                MarketEntity,
                { id: existingMarket.id },
                { status: 'active' },
              );
              this.logger.log(`Market ${parsed.marketId} already exists, status updated to active.`);
            } else {
              // If it doesn't exist, it was likely created directly on-chain or via another admin tool
              await manager.save(
                MarketEntity,
                manager.create(MarketEntity, {
                  title: parsed.title,
                  onChainId: parsed.marketId,
                  status: 'active',
                  lockAt: parsed.lockAt,
                  resolveAt: parsed.resolveAt,
                  createdBy: parsed.createdBy,
                }),
              );
              this.logger.log(`New market ${parsed.marketId} ingested from chain: ${parsed.title}`);
            }

            // Notify creator if we can find them
            const creator = await manager.findOne(UserEntity, {
              where: { primaryWallet: parsed.createdBy },
            });
            if (creator) {
              await this.notificationService.createNotification(
                creator.id,
                `Your market "${parsed.title || existingMarket?.title}" has been successfully created!`,
                'market_created',
              );
            }
          }
          break;

        case 'Market:Resolved':
          {
            const resolvedMarket = await manager.findOne(MarketEntity, {
              where: { onChainId: parsed.marketId },
            });
            if (!resolvedMarket) {
              this.logger.warn(
                `Evento Market:Resolved recebido para onChainId=${parsed.marketId}, mas não existe market off-chain com esse onChainId.`,
              );
              break;
            }

            const marketUuid = resolvedMarket.id;
            const title = resolvedMarket.title || marketUuid;

            await manager.update(
              MarketEntity,
              { id: marketUuid },
              {
                status: 'resolved',
                outcome: parsed.outcome as any,
              },
            );
            this.gateway.emitMarketResolved(marketUuid, {
              outcome: parsed.outcome,
            });

            const feeNgo = Number(resolvedMarket.feeNgo ?? 0);
            const feePlatform = Number(resolvedMarket.feePlatform ?? 0);
            const feeGamification = Number(resolvedMarket.feeGamification ?? 0);
            const totalFeePct = Math.max(
              0,
              feeNgo + feePlatform + feeGamification,
            );

            const allPositions = await manager.find(UserPositionEntity, {
              where: { marketId: marketUuid },
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
              const payout =
                p.outcome === parsed.outcome ? invested + profit : 0;
              return manager.save(UserPositionEntity, {
                ...p,
                status: 'resolved',
                resolvedAt,
                payoutAmount: Number(payout.toFixed(8)),
              });
            });

            if (updates.length) await Promise.all(updates);

            const positions = await manager.find(UserPositionEntity, {
              where: { marketId: marketUuid },
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
          }
          break;

        case 'Impact:Distributed':
          {
            const market = await manager.findOne(MarketEntity, {
              where: { onChainId: parsed.marketId },
            });

            const onChainNgoId = Number(parsed.ngoId);
            const ngo = Number.isFinite(onChainNgoId)
              ? await manager.findOne(NgoEntity, { where: { onChainId: onChainNgoId } })
              : null;

            await manager.save(ImpactLedgerEntryEntity, {
              marketId: market?.id,
              ngoId: ngo?.id ?? parsed.ngoId,
              amount: parseFloat(parsed.amount) / 10000000, // Stroops to USDC
              date: new Date(),
              source: 'fee_pool',
              txHash: event.txHash,
            });

            this.gateway.server.emit('impact_distributed', {
              marketId: market?.id,
              onChainMarketId: parsed.marketId,
              ngoId: ngo?.id ?? parsed.ngoId,
              onChainNgoId: parsed.ngoId,
              amount: parsed.amount,
            });
          }
          break;

        case 'Reward:Claimed':
          {
            const market = await manager.findOne(MarketEntity, {
              where: { onChainId: parsed.marketId },
            });
            if (!market) break;

            const user = await manager.findOne(UserEntity, {
              where: { primaryWallet: parsed.userWallet },
            });
            if (!user) break;

            // Update the position to claimed
            await manager.update(
              UserPositionEntity,
              {
                userId: user.id,
                marketId: market.id,
                status: 'resolved',
              },
              {
                status: 'claimed',
                txHash: event.txHash,
              },
            );

            await this.notificationService.createNotification(
              user.id,
              `You have successfully claimed your reward for market "${market.title}".`,
              'payout_completed',
            );
          }
          break;
        case 'Market:Locked' as any:
          {
            const marketId = (parsed as any).marketId;
            await manager.update(MarketEntity, { onChainId: marketId }, { status: 'locked' });
            this.logger.log(`Market ${marketId} locked on-chain.`);
          }
          break;

        case 'Market:Canceled' as any:
          {
            const marketId = (parsed as any).marketId;
            await manager.update(MarketEntity, { onChainId: marketId }, { status: 'draft' }); // Or maybe a 'cancelled' status if you have it
            this.logger.log(`Market ${marketId} canceled on-chain.`);
          }
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

  private generateSlug(name: string, id: number): string {
    const base = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${base}-${id}`;
  }
}
