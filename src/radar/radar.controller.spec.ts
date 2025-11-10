import { Test, TestingModule } from '@nestjs/testing';
import { RadarController } from './radar.controller';
import { RadarService } from './radar.service';
import { ScanRequestDto } from './dto/scan-request.dto';

describe('RadarController', () => {
  let controller: RadarController;
  let radarService: { get: jest.Mock; post: jest.Mock };

  beforeEach(async () => {
    radarService = {
      get: jest.fn().mockReturnValue('The radar is set and ready to LAUNCH!'),
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RadarController],
      providers: [{ provide: RadarService, useValue: radarService }],
    }).compile();

    controller = module.get<RadarController>(RadarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /radar returns launch message', () => {
    expect(controller.get()).toBe('The radar is set and ready to LAUNCH!');
    expect(radarService.get).toHaveBeenCalledTimes(1);
  });

  it('POST /radar returns service response', () => {
    const dto: ScanRequestDto = { protocols: [], scan: [] };
    const expected = {};
    radarService.post.mockReturnValue(expected);

    const result = controller.post(dto);
    expect(result).toEqual(expected);
    expect(radarService.post).toHaveBeenCalledWith(dto);
  });
});
