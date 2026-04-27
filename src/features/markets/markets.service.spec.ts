import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketEntity } from '../../database/entities/market.entity';
import { MarketSnapshotEntity } from '../../database/entities/market-snapshot.entity';
import { MarketSortOption } from './dto/list-markets-query.dto';

const makeMarket = (overrides: Partial<MarketEntity> = {}): MarketEntity =>
  ({
    id: 'market-1',
    title: 'Will ETH reach $5k by June 2026?',
    description: 'Ethereum price prediction',
    category: 'crypto',
    status: 'active',
    lockAt: new Date('2099-12-31'),
    resolveAt: new Date('2099-12-31'),
    outcome: undefined,
    oracleRef: 'oracle-1',
    assetCode: 'USDC',
    assetIssuer: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGDW:USDC',
    createdBy: 'admin',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }) as MarketEntity;

const makeSnapshot = (
  overrides: Partial<MarketSnapshotEntity> = {},
): MarketSnapshotEntity => {
  const snap = new MarketSnapshotEntity();
  Object.assign(snap, {
    id: 'snap-1',
    marketId: 'market-1',
    timestamp: new Date('2026-04-20T10:00:00Z'),
    yesPool: 6000,
    noPool: 4000,
    tradingVolume: 10000,
    createdAt: new Date('2026-04-20T10:00:00Z'),
    ...overrides,
  });
  return snap;
};

const buildQueryBuilderMock = (result: any) => ({
  andWhere: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  distinctOn: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue(result),
  getMany: jest.fn().mockResolvedValue(Array.isArray(result) ? result : []),
  getOne: jest
    .fn()
    .mockResolvedValue(Array.isArray(result) ? (result[0] ?? null) : result),
});

describe('MarketsService', () => {
  let service: MarketsService;
  let marketRepo: any;
  let snapshotRepo: any;

  beforeEach(async () => {
    marketRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };
    snapshotRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketsService,
        { provide: getRepositoryToken(MarketEntity), useValue: marketRepo },
        {
          provide: getRepositoryToken(MarketSnapshotEntity),
          useValue: snapshotRepo,
        },
      ],
    }).compile();

    service = module.get<MarketsService>(MarketsService);
  });

  // ─── test_list_markets ───────────────────────────────────────────────────────

  describe('test_list_markets', () => {
    it('returns paginated markets with has_next=true when more exist', async () => {
      const markets = [
        makeMarket(),
        makeMarket({ id: 'market-2', title: 'Market 2' }),
      ];
      const qbMarket = buildQueryBuilderMock([markets, 5]);
      marketRepo.createQueryBuilder.mockReturnValue(qbMarket);

      const qbSnap = buildQueryBuilderMock([]);
      snapshotRepo.createQueryBuilder.mockReturnValue(qbSnap);

      const result = await service.findAll({
        limit: 2,
        offset: 0,
        sort: MarketSortOption.NEWEST,
      });

      expect(result.pagination.total).toBe(5);
      expect(result.pagination.has_next).toBe(true);
      expect(result.markets).toHaveLength(2);
    });

    it('filters by status and category', async () => {
      const qbMarket = buildQueryBuilderMock([[makeMarket()], 1]);
      marketRepo.createQueryBuilder.mockReturnValue(qbMarket);
      snapshotRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock([]),
      );

      await service.findAll({
        status: 'active',
        category: 'crypto',
        limit: 20,
        offset: 0,
        sort: MarketSortOption.NEWEST,
      });

      expect(qbMarket.andWhere).toHaveBeenCalledWith('m.status = :status', {
        status: 'active',
      });
      expect(qbMarket.andWhere).toHaveBeenCalledWith('m.category = :category', {
        category: 'crypto',
      });
    });

    it('includes current_prices from latest snapshot in list item', async () => {
      const market = makeMarket();
      const snap = makeSnapshot({ yesPool: 6000, noPool: 4000 });

      marketRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock([[market], 1]),
      );
      snapshotRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock([snap]),
      );

      const result = await service.findAll({
        limit: 20,
        offset: 0,
        sort: MarketSortOption.NEWEST,
      });

      expect(result.markets[0].current_prices).not.toBeNull();
      expect(result.markets[0].current_prices?.yes_probability).toBeCloseTo(
        0.6,
      );
      expect(result.markets[0].current_prices?.no_probability).toBeCloseTo(0.4);
    });

    it('returns current_prices as null when no snapshot exists', async () => {
      marketRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock([[makeMarket()], 1]),
      );
      snapshotRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock([]),
      );

      const result = await service.findAll({
        limit: 20,
        offset: 0,
        sort: MarketSortOption.NEWEST,
      });

      expect(result.markets[0].current_prices).toBeNull();
    });
  });

  // ─── test_market_detail_with_prices ──────────────────────────────────────────

  describe('test_market_detail_with_prices', () => {
    it('returns full market detail with current_prices', async () => {
      const market = makeMarket();
      const snap = makeSnapshot({ yesPool: 7500, noPool: 2500 });

      marketRepo.findOne.mockResolvedValue(market);
      snapshotRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock(snap),
      );

      const result = await service.findOne('market-1');

      expect(result.id).toBe('market-1');
      expect(result.oracle_ref).toBe('oracle-1');
      expect(result.asset_code).toBe('USDC');
      expect(result.current_prices).not.toBeNull();
      expect(result.current_prices?.yes_probability).toBeCloseTo(0.75);
      expect(result.current_prices?.no_probability).toBeCloseTo(0.25);
      expect(result.current_prices?.trading_volume).toBe(10000);
    });

    it('returns current_prices as null when market has no snapshots', async () => {
      marketRepo.findOne.mockResolvedValue(makeMarket());
      snapshotRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock(null),
      );

      const result = await service.findOne('market-1');

      expect(result.current_prices).toBeNull();
    });

    it('throws NotFoundException for unknown market id', async () => {
      marketRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── test_derived_status_logic ───────────────────────────────────────────────

  describe('test_derived_status_logic', () => {
    it('returns LOCKED when status is active and lockAt is in the past', () => {
      const market = makeMarket({
        status: 'active',
        lockAt: new Date('2020-01-01'),
      });
      expect(service.derivedStatus(market)).toBe('LOCKED');
    });

    it('returns active when status is active and lockAt is in the future', () => {
      const market = makeMarket({
        status: 'active',
        lockAt: new Date('2099-12-31'),
      });
      expect(service.derivedStatus(market)).toBe('active');
    });

    it('returns locked without change when status is already locked', () => {
      const market = makeMarket({
        status: 'locked',
        lockAt: new Date('2020-01-01'),
      });
      expect(service.derivedStatus(market)).toBe('locked');
    });

    it('returns resolved without change when status is resolved', () => {
      const market = makeMarket({
        status: 'resolved',
        lockAt: new Date('2020-01-01'),
      });
      expect(service.derivedStatus(market)).toBe('resolved');
    });

    it('includes derived_status in findOne response', async () => {
      // market is "active" in DB but lockAt already passed → UI should show LOCKED
      const pastLock = new Date('2020-01-01');
      marketRepo.findOne.mockResolvedValue(
        makeMarket({ status: 'active', lockAt: pastLock }),
      );
      snapshotRepo.createQueryBuilder.mockReturnValue(
        buildQueryBuilderMock(null),
      );

      const result = await service.findOne('market-1');

      expect(result.status).toBe('active');
      expect(result.derived_status).toBe('LOCKED');
    });
  });
});
