import { DistanceService } from './distance.service';
import { ConfigService } from '@nestjs/config';

describe('DistanceService', () => {
  let service: DistanceService;
  let config: { get: jest.Mock };

  beforeEach(() => {
    config = { get: jest.fn() };
    service = new DistanceService(config as unknown as ConfigService);
  });

  it('getDistance computes hypot', () => {
    expect(service.getDistance([0, 0])).toBe(0);
    expect(service.getDistance([3, 4])).toBe(5);
  });

  it('getMaxRange returns configured number', () => {
    config.get.mockReturnValue(250);
    expect(service.getMaxRange()).toBe(250);
  });

  it('getMaxRange falls back to 100 when undefined', () => {
    config.get.mockReturnValue(undefined);
    expect(service.getMaxRange()).toBe(100);
  });

  it('getMaxRange falls back to 100 when NaN or non-number', () => {
    config.get.mockReturnValue(NaN as unknown as number);
    expect(service.getMaxRange()).toBe(100);
    config.get.mockReturnValue('not-a-number' as unknown as number);
    expect(service.getMaxRange()).toBe(100);
  });
});
