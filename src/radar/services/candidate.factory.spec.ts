import { ScanRequestDto } from '../dto/scan-request.dto';
import { CandidateFactory } from './candidate.factory';
import { DistanceService } from './distance.service';

describe('CandidateFactory', () => {
  let factory: CandidateFactory;
  let distance: { getMaxRange: jest.Mock; getDistance: jest.Mock };

  beforeEach(() => {
    distance = {
      getMaxRange: jest.fn().mockReturnValue(50),
      getDistance: jest.fn((coords: [number, number]) =>
        Math.hypot(coords[0], coords[1]),
      ),
    };
    factory = new CandidateFactory(distance as unknown as DistanceService);
  });

  it('filters out scan entries beyond max range and maps correctly', () => {
    const dto: ScanRequestDto = {
      protocols: [],
      scan: [
        {
          coordinates: { x: 40, y: 40 },
          enemies: { type: 'soldier', number: 1 },
        },
        {
          coordinates: { x: 3, y: 4 },
          allies: 2,
          enemies: { type: 'soldier', number: 1 },
        },
      ],
    };

    const result = factory.fromScanRequest(dto);

    expect(distance.getMaxRange).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      coordinates: [3, 4],
      distance: 5,
      allies: 2,
      enemies: { type: 'soldier', number: 1 },
    });
  });
});
