import { Test, TestingModule } from '@nestjs/testing';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import RouteRequestDto from './dto/route-request.dto';

describe('RouteController', () => {
  let controller: RouteController;
  let service: RouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteController],
      providers: [RouteService],
    }).compile();

    controller = module.get<RouteController>(RouteController);
    service = module.get<RouteService>(RouteService);
  });

  describe('post', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call service.post with request body', () => {
      const request: RouteRequestDto = {
        radar: [[5, 10, 3]],
        position: [0, 0],
      };

      const spy = jest.spyOn(service, 'post');
      controller.post(request);

      expect(spy).toHaveBeenCalledWith(request);
    });

    it('should handle empty radar', () => {
      const request: RouteRequestDto = {
        radar: [],
        position: [0, 0],
      };

      const result = controller.post(request);

      expect(result).toEqual([]);
    });

    it('should return coordinates without soldiers data', () => {
      const request: RouteRequestDto = {
        radar: [[5, 10, 3]],
        position: [0, 0],
      };

      const result = controller.post(request);

      expect(result[0]).toEqual([5, 10]);
      expect(result[0].length).toBe(2);
    });

    it('should handle multiple radar points', () => {
      const request: RouteRequestDto = {
        radar: [
          [5, 10, 3],
          [2, 8, 1],
          [8, 12, 2],
          [1, 1, 5],
        ],
        position: [0, 0],
      };

      const result = controller.post(request);

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(4);
    });

    it('should handle negative coordinates', () => {
      const request: RouteRequestDto = {
        radar: [
          [-5, -10, 3],
          [-2, -8, 1],
        ],
        position: [0, 0],
      };

      const result = controller.post(request);

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
