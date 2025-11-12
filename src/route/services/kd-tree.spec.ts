import { KDTree } from './kd-tree';
import { CoordinateInfo } from '../types/coordinate.type';

describe('KDTree', () => {
  describe('constructor and tree structure', () => {
    it('should build tree structure with correct root', () => {
      const points: [number, number, number][] = [
        [5, 10, 3],
        [2, 8, 1],
        [8, 12, 2],
      ];

      const tree = new KDTree(points);
      const root = tree.getRoot();

      expect(root).not.toBeNull();
      expect(root?.point).toBeDefined();
      expect(root?.left).toBeDefined();
      expect(root?.right).toBeDefined();
    });

    it('should build balanced tree with correct median as root', () => {
      const points: [number, number, number][] = [
        [5, 10, 3],
        [2, 8, 1],
        [8, 12, 2],
      ];

      const tree = new KDTree(points);
      const root = tree.getRoot();

      expect(root?.point.x).toBe(5);
      expect(root?.point.y).toBe(10);
      expect(root?.point.soldiers).toBe(3);
    });

    it('should find nearest point correctly after tree is built', () => {
      const points: [number, number, number][] = [
        [5, 10, 3],
        [2, 8, 1],
        [8, 12, 2],
      ];

      const tree = new KDTree(points);
      const result = tree.findChain({ x: 4, y: 8, soldiers: 1 }, 1);

      expect(result).toEqual([{ x: 2, y: 8, soldiers: 1 }]);
    });

    it('should handle empty points array', () => {
      const tree = new KDTree([]);
      const result = tree.findChain({ x: 5, y: 10, soldiers: 0 }, 1);

      expect(result).toEqual([]);
    });

    it('should handle single point', () => {
      const points: [number, number, number][] = [[5, 10, 3]];
      const tree = new KDTree(points);
      const result = tree.findChain({ x: 0, y: 0, soldiers: 0 }, 1);

      expect(result).toEqual([{ x: 5, y: 10, soldiers: 3 }]);
    });
  });

  describe('findChain', () => {
    let tree: KDTree;

    beforeEach(() => {
      const points: [number, number, number][] = [
        [5, 10, 3],
        [2, 8, 1],
        [8, 12, 2],
        [1, 1, 5],
        [9, 9, 4],
      ];
      tree = new KDTree(points);
    });

    it('should return empty chain when length is 0', () => {
      const start: CoordinateInfo = { x: 5, y: 10, soldiers: 0 };
      const result = tree.findChain(start, 0);

      expect(result).toEqual([]);
    });

    it('should find nearest points in order of proximity', () => {
      const start: CoordinateInfo = { x: 0, y: 0, soldiers: 0 };
      const result = tree.findChain(start, 5);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual({ x: 1, y: 1, soldiers: 5 });
    });

    it('should not include duplicate points in chain', () => {
      const start: CoordinateInfo = { x: 0, y: 0, soldiers: 0 };
      const result = tree.findChain(start, 5);
      const uniqueCoords = new Set(result.map((p) => `${p.x}-${p.y}`));

      expect(uniqueCoords.size).toBe(result.length);
    });

    it('should find chain starting from non-tree point', () => {
      const start: CoordinateInfo = { x: 100, y: 100, soldiers: 0 };
      const result = tree.findChain(start, 3);

      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('findChain with soldiers preference', () => {
    it('should prefer points with more soldiers when equidistant', () => {
      const points: [number, number, number][] = [
        [0, 0, 2],
        [2, 0, 5],
        [0, 2, 3],
      ];
      const tree = new KDTree(points);
      const start: CoordinateInfo = { x: 1, y: 1, soldiers: 0 };
      const result = tree.findChain(start, 1);

      expect(result[0]?.soldiers).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('should handle large coordinate values', () => {
      const points: [number, number, number][] = [
        [1000, 2000, 10],
        [1001, 2001, 5],
      ];

      const tree = new KDTree(points);
      const result = tree.findChain({ x: 1000, y: 2000, soldiers: 0 }, 2);

      expect(result.length).toBe(2);
    });

    it('should handle negative coordinates', () => {
      const points: [number, number, number][] = [
        [-5, -10, 3],
        [-2, -8, 1],
      ];
      const tree = new KDTree(points);
      const result = tree.findChain({ x: 0, y: 0, soldiers: 0 }, 2);

      expect(result.length).toBe(2);
    });

    it('should handle zero soldier counts', () => {
      const points: [number, number, number][] = [
        [5, 10, 0],
        [2, 8, 0],
      ];
      const tree = new KDTree(points);
      const result = tree.findChain({ x: 0, y: 0, soldiers: 0 }, 2);

      expect(result.length).toBe(2);
    });

    it('should handle many points', () => {
      const points: [number, number, number][] = [];
      for (let i = 0; i < 100; i++) {
        points.push([
          Math.random() * 1000,
          Math.random() * 1000,
          Math.random() * 10,
        ]);
      }

      const tree = new KDTree(points);
      const result = tree.findChain({ x: 500, y: 500, soldiers: 0 }, 10);

      expect(result.length).toBeLessThanOrEqual(10);
      const uniqueCoords = new Set(result.map((p) => `${p.x}-${p.y}`));

      expect(uniqueCoords.size).toBe(result.length);
    });
  });
});
