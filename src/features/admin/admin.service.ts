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

  async createMarket(dto: CreateMarketDto, admin: any) {
    const contractId = this.config.get('STELLAR_CONTRACT_ID', 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4');
    
    const lockAtUnix = BigInt(Math.floor(new Date(dto.lockAt).getTime() / 1000));
    const resolveAtUnix = BigInt(Math.floor(new Date(dto.resolveAt).getTime() / 1000));

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'create_market',
          args: [
            StellarSdk.nativeToScVal(dto.title, { type: 'string' }),
            StellarSdk.nativeToScVal(lockAtUnix, { type: 'u64' }),
            StellarSdk.nativeToScVal(resolveAtUnix, { type: 'u64' }),
          ],
        }),
      ),
      auth: [],
    });

    const xdr = this.buildXdr(admin.wallet, op);

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

    return { xdr, action: 'CREATE_MARKET' };
  }

  async resolveMarket(id: string, outcome: 'YES' | 'NO', admin: any) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const contractId = market.contractAddress || this.config.get<string>('STELLAR_CONTRACT_ID', 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4');
    const marketIdU64 = BigInt(1); // Should be mapped from market.id in a real scenario
    const outcomeU32 = outcome === 'YES' ? 1 : 2;

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'resolve_market',
          args: [
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
            StellarSdk.nativeToScVal(outcomeU32, { type: 'u32' }),
          ],
        }),
      ),
      auth: [],
    });

    const xdr = this.buildXdr(admin.wallet, op);

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

    return { xdr, action: 'RESOLVE_MARKET' };
  }

  async cancelMarket(id: string, admin: any) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const contractId = market.contractAddress || this.config.get<string>('STELLAR_CONTRACT_ID', 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4');
    const marketIdU64 = BigInt(1);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'cancel_market',
          args: [
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
          ],
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

  async distributeImpact(id: string, admin: any) {
    const market = await this.marketRepo.findOne({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const contractId = market.contractAddress || this.config.get<string>('STELLAR_CONTRACT_ID', 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4');
    const marketIdU64 = BigInt(1);

    const op = StellarSdk.Operation.invokeHostFunction({
      func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
        new StellarSdk.xdr.InvokeContractArgs({
          contractAddress: StellarSdk.Address.fromString(contractId).toScAddress(),
          functionName: 'distribute_impact_funds',
          args: [
            StellarSdk.nativeToScVal(marketIdU64, { type: 'u64' }),
          ],
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
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(wallet, '0'),
      { fee: '10000', networkPassphrase: StellarSdk.Networks.TESTNET }
    )
      .addOperation(op)
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();

    return tx.toXDR();
  }
}
