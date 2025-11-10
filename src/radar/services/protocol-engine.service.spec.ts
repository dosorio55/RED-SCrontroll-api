import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolEngineService } from './protocol-engine.service';
import { ProtocolOrderResolver } from './protocol-order.resolver';
import { ProtocolFilterService } from './protocol-filter.service';
import { PROTOCOL_STRATEGY_MAP } from '../strategies/strategy.tokens';
import { Protocol } from '../types/protocol.enum';
import { ProtocolStrategy } from '../strategies/protocol-strategy';
import Candidate from '../types/candidate.type';

describe('ProtocolEngineService', () => {
  let service: ProtocolEngineService;
  let resolver: {
    resolveFilteringProtocols: jest.Mock;
    resolveSortingProtocols: jest.Mock;
  };
  let filter: { filterCandidatesByProtocols: jest.Mock };
  let strategies: Partial<Record<Protocol, ProtocolStrategy>>;

  beforeEach(async () => {
    resolver = {
      resolveFilteringProtocols: jest.fn(),
      resolveSortingProtocols: jest.fn(),
    };
    filter = {
      filterCandidatesByProtocols: jest.fn(),
    };
    strategies = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolEngineService,
        { provide: ProtocolOrderResolver, useValue: resolver },
        { provide: ProtocolFilterService, useValue: filter },
        { provide: PROTOCOL_STRATEGY_MAP, useValue: strategies },
      ],
    }).compile();

    service = module.get(ProtocolEngineService);
  });

  it('returns filteredCandidates when no sorting protocols', () => {
    const protocols = [] as Protocol[];
    const candidates = [{ coordinates: [1, 1], distance: 1 } as Candidate];
    const filtered = [{ coordinates: [2, 2], distance: 2 } as Candidate];

    resolver.resolveFilteringProtocols.mockReturnValue([]);
    resolver.resolveSortingProtocols.mockReturnValue([]);
    filter.filterCandidatesByProtocols.mockReturnValue(filtered);

    const result = service.run(protocols, candidates);

    expect(filter.filterCandidatesByProtocols).toHaveBeenCalled();
    expect(result).toEqual(filtered);
  });

  it('applies first available sorting strategy and returns immediately', () => {
    const protocols = [Protocol.ClosestEnemies, Protocol.FurthestEnemies];
    const candidates = [{ coordinates: [1, 1], distance: 1 } as Candidate];
    const filtered = [{ coordinates: [2, 2], distance: 2 } as Candidate];
    const sorted = [{ coordinates: [3, 3], distance: 3 } as Candidate];

    resolver.resolveFilteringProtocols.mockReturnValue([]);
    resolver.resolveSortingProtocols.mockReturnValue([
      Protocol.ClosestEnemies,
      Protocol.FurthestEnemies,
    ]);
    filter.filterCandidatesByProtocols.mockReturnValue(filtered);

    const closestStrategy = { apply: jest.fn().mockReturnValue(sorted) };
    strategies[Protocol.ClosestEnemies] = {
      apply: closestStrategy.apply,
      key: Protocol.ClosestEnemies,
    };

    const result = service.run(protocols, candidates);

    expect(closestStrategy.apply).toHaveBeenCalledWith(filtered);
    expect(result).toEqual(sorted);
  });

  it('falls back to filteredCandidates when strategy is missing', () => {
    const protocols = [Protocol.ClosestEnemies];
    const candidates = [{ coordinates: [1, 1], distance: 1 } as Candidate];
    const filtered = [{ coordinates: [2, 2], distance: 2 } as Candidate];

    resolver.resolveFilteringProtocols.mockReturnValue([]);
    resolver.resolveSortingProtocols.mockReturnValue([Protocol.ClosestEnemies]);
    filter.filterCandidatesByProtocols.mockReturnValue(filtered);

    const result = service.run(protocols, candidates);

    expect(result).toEqual(filtered);
  });
});
