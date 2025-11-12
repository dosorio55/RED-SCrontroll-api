import { RouteService } from './route.service';
import RouteRequestDto from './dto/route-request.dto';

describe('RouteService', () => {
  let service: RouteService;

  beforeEach(() => {
    service = new RouteService();
  });

  describe('post', () => {
    it('should return empty array when radar is empty', () => {
      const request: RouteRequestDto = {
        radar: [],
        position: [0, 0],
      };

      const result = service.post(request);

      expect(result).toEqual([]);
    });

    it('should return only x and y coordinates, not soldiers', () => {
      const request: RouteRequestDto = {
        radar: [[5, 10, 3]],
        position: [0, 0],
      };

      const result = service.post(request);

      expect(result).toEqual([[5, 10]]);
      expect(result[0].length).toBe(2);
    });

    it('should find chain starting from given position', () => {
      const request: RouteRequestDto = {
        radar: [
          [5, 10, 3],
          [2, 8, 1],
          [8, 12, 2],
          [1, 1, 5],
        ],
        position: [0, 0],
      };

      const result = service.post(request);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeDefined();
    });

    it('should handle position at radar point', () => {
      const request: RouteRequestDto = {
        radar: [
          [5, 10, 3],
          [2, 8, 1],
        ],
        position: [5, 10],
      };

      const result = service.post(request);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle negative coordinates', () => {
      const request: RouteRequestDto = {
        radar: [
          [-5, -10, 3],
          [-2, -8, 1],
        ],
        position: [0, 0],
      };

      const result = service.post(request);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle large coordinate values', () => {
      const request: RouteRequestDto = {
        radar: [
          [1000, 2000, 10],
          [1001, 2001, 5],
        ],
        position: [1000, 2000],
      };

      const result = service.post(request);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle many radar points', () => {
      const radarPoints: [number, number, number][] = [];
      for (let i = 0; i < 50; i++) {
        radarPoints.push([
          Math.random() * 1000,
          Math.random() * 1000,
          Math.floor(Math.random() * 10),
        ]);
      }

      const request: RouteRequestDto = {
        radar: radarPoints,
        position: [500, 500],
      };

      const result = service.post(request);

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(radarPoints.length);
    });
  });
});
