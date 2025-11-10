import { Test, TestingModule } from '@nestjs/testing';
import { RadarService } from './radar.service';
import { CandidateFactory } from './services/candidate.factory';
import { ProtocolEngineService } from './services/protocol-engine.service';
import { ScanRequestDto } from './dto/scan-request.dto';
import { Protocol } from './types/protocol.enum';

describe('RadarService', () => {
  let service: RadarService;
  let factory: { fromScanRequest: jest.Mock };
  let engine: { run: jest.Mock };

  beforeEach(async () => {
    factory = { fromScanRequest: jest.fn() };
    engine = { run: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RadarService,
        { provide: CandidateFactory, useValue: factory },
        { provide: ProtocolEngineService, useValue: engine },
      ],
    }).compile();

    service = module.get<RadarService>(RadarService);
  });

  it('get returns launch message', () => {
    const result = service.get();

    expect(result).toBe('The radar is set and ready to LAUNCH!');
  });

  it('post returns empty object when engine returns empty array', () => {
    const dto: ScanRequestDto = {
      protocols: [Protocol.ClosestEnemies],
      scan: [
        {
          coordinates: { x: 10, y: 20 },
          enemies: { type: 'soldier', number: 1 },
        },
      ],
    };
    const candidates = [];
    const expectedResult = {};

    factory.fromScanRequest.mockReturnValue(candidates);
    engine.run.mockReturnValue([]);

    const result = service.post(dto);

    expect(factory.fromScanRequest).toHaveBeenCalledWith(dto);
    expect(factory.fromScanRequest).toHaveBeenCalledTimes(1);
    expect(engine.run).toHaveBeenCalledWith(dto.protocols, candidates);
    expect(engine.run).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  it('post returns coordinates from first candidate when engine yields results', () => {
    const dto: ScanRequestDto = {
      protocols: [Protocol.ClosestEnemies],
      scan: [
        {
          coordinates: { x: 10, y: 20 },
          enemies: { type: 'soldier', number: 1 },
        },
      ],
    };
    const candidates = [{ coordinates: [10, 20], distance: 22.36 }];
    const engineResult = [
      { coordinates: [15, 25], distance: 29.15 },
      { coordinates: [30, 40], distance: 50 },
    ];
    const expectedResult = { x: 15, y: 25 };

    factory.fromScanRequest.mockReturnValue(candidates);
    engine.run.mockReturnValue(engineResult);

    const result = service.post(dto);

    expect(factory.fromScanRequest).toHaveBeenCalledWith(dto);
    expect(factory.fromScanRequest).toHaveBeenCalledTimes(1);
    expect(engine.run).toHaveBeenCalledWith(dto.protocols, candidates);
    expect(engine.run).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  it('post returns empty object when engine returns null', () => {
    const dto: ScanRequestDto = {
      protocols: [Protocol.AvoidMech],
      scan: [
        {
          coordinates: { x: 5, y: 5 },
          enemies: { type: 'mech', number: 1 },
        },
      ],
    };
    const candidates = [{ coordinates: [5, 5], distance: 7.07 }];
    const expectedResult = {};

    factory.fromScanRequest.mockReturnValue(candidates);
    engine.run.mockReturnValue(null);

    const result = service.post(dto);

    expect(factory.fromScanRequest).toHaveBeenCalledWith(dto);
    expect(engine.run).toHaveBeenCalledWith(dto.protocols, candidates);
    expect(result).toEqual(expectedResult);
  });

  it('post returns only first candidate coordinates when multiple results', () => {
    const dto: ScanRequestDto = {
      protocols: [Protocol.FurthestEnemies],
      scan: [
        {
          coordinates: { x: 100, y: 100 },
          enemies: { type: 'soldier', number: 2 },
        },
      ],
    };
    const candidates = [{ coordinates: [100, 100], distance: 141.42 }];
    const engineResult = [
      { coordinates: [100, 100], distance: 141.42 },
      { coordinates: [50, 50], distance: 70.71 },
      { coordinates: [25, 25], distance: 35.36 },
    ];
    const expectedResult = { x: 100, y: 100 };

    factory.fromScanRequest.mockReturnValue(candidates);
    engine.run.mockReturnValue(engineResult);

    const result = service.post(dto);

    expect(result).toEqual(expectedResult);
  });
});
