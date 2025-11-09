import { Test, TestingModule } from '@nestjs/testing';
import { RadarService } from './radar.service';

describe('RadarService', () => {
  let service: RadarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadarService],
    }).compile();

    service = module.get<RadarService>(RadarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get should return "radar"', () => {
    expect(service.get()).toBe('radar');
  });
});
