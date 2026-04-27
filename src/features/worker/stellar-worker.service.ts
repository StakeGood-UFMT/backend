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
import { StakeGoodGateway } from '../websocket/stakegood.gateway';

const CURSOR_KEY = 'default';
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 60_000;

export interface HorizonEvent {
  id: string;
  type: string;
  topic: string[]; // base64-encoded XDR ScVal per topic
  value: string; // base64-encoded XDR ScVal
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
  private abortController: AbortController | null = null;
  private reconnectAttempt = 0;

  constructor(
    @InjectRepository(ProcessedTransactionEntity)
    private readonly processedTxRepo: Repository<ProcessedTransactionEntity>,
    @InjectRepository(WorkerCursorEntity)
    private readonly cursorRepo: Repository<WorkerCursorEntity>,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
    private readonly gateway: StakeGoodGateway,
  ) {}

  onModuleInit() {
    if (this.config.get('NODE_ENV') !== 'test') {
      this.running = true;
      this.startStream();
    }
  }

  onModuleDestroy() {
    this.running = false;
    this.abortController?.abort();
  }

  private async startStream(): Promise<void> {
    const cursor = await this.loadCursor();
    const horizonUrl = this.config.get<string>(
      'STELLAR_HORIZON_URL',
      'https://horizon-testnet.stellar.org',
    );
    const contractId = this.config.get<string>('STELLAR_CONTRACT_ID', '');

    const url = `${horizonUrl}/contracts/${contractId}/events?cursor=${cursor}&order=asc&limit=200`;

    this.logger.log(`Worker conectando ao Horizon (cursor=${cursor})`);

    try {
      this.abortController = new AbortController();
      const response = await fetch(url, {
        headers: { Accept: 'text/event-stream' },
        signal: this.abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Horizon respondeu com status ${response.status}`);
      }

      this.reconnectAttempt = 0;
      await this.consumeStream(response.body);
    } catch (err: any) {
      if (!this.running) return;
      const delay = Math.min(
        BASE_DELAY_MS * 2 ** this.reconnectAttempt,
        MAX_DELAY_MS,
      );
      this.reconnectAttempt++;
      this.logger.warn(
        `Erro no stream (tentativa ${this.reconnectAttempt}), reconectando em ${delay}ms: ${err.message}`,
      );
      await this.sleep(delay);
      if (this.running) this.startStream();
    }
  }

  private async consumeStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (this.running) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const raw = line.slice(5).trim();
          if (raw && raw !== '{}') {
            await this.dispatchEvent(raw);
          }
        }
      }
    }

    if (this.running) {
      this.logger.log('Stream encerrado pelo servidor, reconectando...');
      await this.startStream();
    }
  }

  private async dispatchEvent(rawJson: string): Promise<void> {
    let event: HorizonEvent;
    try {
      event = JSON.parse(rawJson) as HorizonEvent;
    } catch {
      this.logger.warn(`Evento inválido ignorado: ${rawJson.slice(0, 100)}`);
      return;
    }

    const parsed = this.parseContractEvent(event);
    if (!parsed) return;

    const alreadyProcessed = await this.isAlreadyProcessed(
      event.txHash,
      event.opIndex,
    );
    if (alreadyProcessed) {
      this.logger.debug(
        `Tx duplicada ignorada: ${event.txHash}[${event.opIndex}]`,
      );
      return;
    }

    await this.persistAtomically(parsed, event);
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
          break;

        case 'Market:Resolved':
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
