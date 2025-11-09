import { Test, TestingModule } from '@nestjs/testing';
import { RadarController } from './radar.controller';
import { RadarService } from './radar.service';

describe('RadarController', () => {
  let controller: RadarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RadarController],
      providers: [RadarService],
    }).compile();

    controller = module.get<RadarController>(RadarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /radar returns "radar"', () => {
    expect(controller.get()).toBe('radar');
  });
});
