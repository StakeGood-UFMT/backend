import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserPositionEntity } from '../../database/entities/user-position.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { StakeGoodGateway } from '../websocket/stakegood.gateway';
export declare class StellarWorkerService implements OnModuleInit, OnModuleDestroy {
    private readonly positionRepo;
    private readonly snapshotRepo;
    private readonly gateway;
    private readonly config;
    private readonly logger;
    private running;
    constructor(positionRepo: Repository<UserPositionEntity>, snapshotRepo: Repository<MarketSnapshotEntity>, gateway: StakeGoodGateway, config: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private startListening;
    processTransaction(txHash: string, _xdrData: any): Promise<void>;
}
