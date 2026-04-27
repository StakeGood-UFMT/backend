import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { StellarWorkerService, HorizonEvent } from './stellar-worker.service';
import { ProcessedTransactionEntity } from '../../database/entities/processed-transaction.entity';
import { WorkerCursorEntity } from '../../database/entities/worker-cursor.entity';
import { NgoEntity } from '../../database/entities/ngo.entity';
import { MarketEntity } from '../../database/entities/market.entity';

const makeEvent = (overrides: Partial<HorizonEvent> = {}): HorizonEvent => ({
  id: 'evt-1',
  type: 'contract',
  topic: ['NGO', 'Registered'],
  value: JSON.stringify({ wallet_address: 'GABC123', name: 'TestNGO' }),
  ledger: 42,
  txHash: 'deadbeef',
  opIndex: 0,
  ...overrides,
});

describe('StellarWorkerService', () => {
  let service: StellarWorkerService;
  let processedTxRepo: jest.Mocked<Repository<ProcessedTransactionEntity>>;
  let cursorRepo: jest.Mocked<Repository<WorkerCursorEntity>>;

  const mockManager = {
    upsert: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    insert: jest.fn().mockResolvedValue(undefined),
  };

  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation(
        async (cb: (m: typeof mockManager) => Promise<void>) => {
          await cb(mockManager);
        },
      ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StellarWorkerService,
        {
          provide: getRepositoryToken(ProcessedTransactionEntity),
          useValue: { countBy: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(WorkerCursorEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(NgoEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(MarketEntity),
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((_key: string, def?: any) => def ?? '') },
        },
      ],
    }).compile();

    service = module.get(StellarWorkerService);
    processedTxRepo = module.get(
      getRepositoryToken(ProcessedTransactionEntity),
    );
    cursorRepo = module.get(getRepositoryToken(WorkerCursorEntity));
  });

  describe('test_worker_deduplication', () => {
    it('ignora evento cujo tx_hash+op_index já foi processado', async () => {
      (processedTxRepo.countBy as jest.Mock).mockResolvedValue(1);

      await (service as any).dispatchEvent(JSON.stringify(makeEvent()));

      expect(mockDataSource.transaction).not.toHaveBeenCalled();
      expect(mockManager.insert).not.toHaveBeenCalled();
    });

    it('processa evento novo e registra em processed_transactions', async () => {
      (processedTxRepo.countBy as jest.Mock).mockResolvedValue(0);

      await (service as any).dispatchEvent(JSON.stringify(makeEvent()));

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(mockManager.insert).toHaveBeenCalledWith(
        ProcessedTransactionEntity,
        expect.objectContaining({
          txHash: 'deadbeef',
          opIndex: 0,
          eventType: 'NGO:Registered',
        }),
      );
    });

    it('não processa duas vezes o mesmo evento em chamadas consecutivas', async () => {
      (processedTxRepo.countBy as jest.Mock)
        .mockResolvedValueOnce(0) // primeira chamada: novo
        .mockResolvedValueOnce(1); // segunda chamada: duplicado

      const event = JSON.stringify(makeEvent());
      await (service as any).dispatchEvent(event);
      await (service as any).dispatchEvent(event);

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('test_worker_cursor_persistence', () => {
    it('atualiza o cursor para o ledger do evento processado', async () => {
      (processedTxRepo.countBy as jest.Mock).mockResolvedValue(0);
      (cursorRepo.findOne as jest.Mock).mockResolvedValue({
        id: 'default',
        lastLedgerId: '100',
      });

      await (service as any).dispatchEvent(
        JSON.stringify(makeEvent({ ledger: 105 })),
      );

      expect(mockManager.upsert).toHaveBeenCalledWith(
        WorkerCursorEntity,
        expect.objectContaining({ id: 'default', lastLedgerId: '105' }),
        ['id'],
      );
    });

    it('não atualiza o cursor se o evento falhar', async () => {
      (processedTxRepo.countBy as jest.Mock).mockResolvedValue(0);
      mockDataSource.transaction.mockRejectedValueOnce(new Error('DB error'));

      await expect(
        (service as any).dispatchEvent(
          JSON.stringify(makeEvent({ ledger: 105 })),
        ),
      ).rejects.toThrow('DB error');

      const cursor = await (service as any).loadCursor();
      expect(cursor).not.toBe('105');
    });

    it('carrega cursor existente ao inicializar stream', async () => {
      (cursorRepo.findOne as jest.Mock).mockResolvedValue({
        id: 'default',
        lastLedgerId: '200',
      });

      const cursor = await (service as any).loadCursor();

      expect(cursor).toBe('200');
    });

    it('usa cursor 0 quando não existe registro prévio', async () => {
      (cursorRepo.findOne as jest.Mock).mockResolvedValue(null);

      const cursor = await (service as any).loadCursor();

      expect(cursor).toBe('0');
    });
  });

  describe('parseContractEvent', () => {
    it('parseia NGO:Registered corretamente', () => {
      const event = makeEvent();
      const result = (service as any).parseContractEvent(event);
      expect(result).toEqual({
        kind: 'NGO:Registered',
        walletAddress: 'GABC123',
        name: 'TestNGO',
      });
    });

    it('parseia NGO:Deactivated corretamente', () => {
      const event = makeEvent({
        topic: ['NGO', 'Deactivated'],
        value: JSON.stringify({ wallet_address: 'GABC123' }),
      });
      const result = (service as any).parseContractEvent(event);
      expect(result).toEqual({
        kind: 'NGO:Deactivated',
        walletAddress: 'GABC123',
      });
    });

    it('parseia Market:Created corretamente', () => {
      const lockAt = '2026-06-01T00:00:00.000Z';
      const resolveAt = '2026-07-01T00:00:00.000Z';
      const event = makeEvent({
        topic: ['Market', 'Created'],
        value: JSON.stringify({
          contract_id: 'CXYZ',
          title: 'Market Test',
          lock_at: lockAt,
          resolve_at: resolveAt,
          created_by: 'GABC123',
        }),
      });
      const result = (service as any).parseContractEvent(event);
      expect(result).toMatchObject({
        kind: 'Market:Created',
        title: 'Market Test',
        createdBy: 'GABC123',
      });
    });

    it('retorna null para evento desconhecido', () => {
      const event = makeEvent({ topic: ['Unknown', 'Event'] });
      const result = (service as any).parseContractEvent(event);
      expect(result).toBeNull();
    });
  });
});
