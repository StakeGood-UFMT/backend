import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { StakeGoodGateway } from '../websocket/stakegood.gateway';

@Injectable()
export class StellarWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StellarWorkerService.name);
  private running = false;

  constructor(
    @InjectRepository(UserPositionEntity)
    private readonly positionRepo: Repository<UserPositionEntity>,
    @InjectRepository(MarketSnapshotEntity)
    private readonly snapshotRepo: Repository<MarketSnapshotEntity>,
    private readonly gateway: StakeGoodGateway,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    if (this.config.get('NODE_ENV') !== 'test') {
      this.startListening();
    }
  }

  onModuleDestroy() {
    this.running = false;
  }

  private startListening() {
    this.running = true;
    this.logger.log('Stellar worker started — listening for on-chain events');
    // TODO: Connect to Stellar Horizon WebSocket stream
    // const horizonUrl = this.config.get('STELLAR_HORIZON_URL');
    // EventSource listener will index transactions idempotently
  }

  async processTransaction(txHash: string, _xdrData: any) {
    const existing = await this.positionRepo.findOne({ where: { txHash } });
    if (existing) {
      this.logger.debug(`Duplicate tx ignored: ${txHash}`);
      return;
    }
    // TODO: Parse XDR, create position, update snapshot, emit WS event
  }
}
