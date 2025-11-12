import { KDNode } from './kd-node.model';
import { CoordinateInfo } from '../types/coordinate.type';

describe('KDNode', () => {
  it('should create a node with a coordinate', () => {
    const coordinate: CoordinateInfo = { x: 5, y: 10, soldiers: 3 };
    const node = new KDNode(coordinate);

    expect(node.point).toEqual(coordinate);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });

  it('should allow setting left child', () => {
    const coordinate1: CoordinateInfo = { x: 5, y: 10, soldiers: 3 };
    const coordinate2: CoordinateInfo = { x: 2, y: 8, soldiers: 1 };

    const node1 = new KDNode(coordinate1);
    const node2 = new KDNode(coordinate2);

    node1.left = node2;

    expect(node1.left).toBe(node2);
    expect(node1.right).toBeNull();
  });

  it('should allow setting right child', () => {
    const coordinate1: CoordinateInfo = { x: 5, y: 10, soldiers: 3 };
    const coordinate2: CoordinateInfo = { x: 8, y: 12, soldiers: 2 };

    const node1 = new KDNode(coordinate1);
    const node2 = new KDNode(coordinate2);

    node1.right = node2;

    expect(node1.right).toBe(node2);
    expect(node1.left).toBeNull();
  });

  it('should allow setting both children', () => {
    const coordinate1: CoordinateInfo = { x: 5, y: 10, soldiers: 3 };
    const coordinate2: CoordinateInfo = { x: 2, y: 8, soldiers: 1 };
    const coordinate3: CoordinateInfo = { x: 8, y: 12, soldiers: 2 };

    const node1 = new KDNode(coordinate1);
    const node2 = new KDNode(coordinate2);
    const node3 = new KDNode(coordinate3);

    node1.left = node2;
    node1.right = node3;

    expect(node1.left).toBe(node2);
    expect(node1.right).toBe(node3);
  });

  it('should handle zero soldier counts', () => {
    const coordinate: CoordinateInfo = { x: 5, y: 10, soldiers: 0 };
    const node = new KDNode(coordinate);

    expect(node.point.soldiers).toBe(0);
  });

  it('should handle negative coordinates', () => {
    const coordinate: CoordinateInfo = { x: -5, y: -10, soldiers: 3 };
    const node = new KDNode(coordinate);

    expect(node.point.x).toBe(-5);
    expect(node.point.y).toBe(-10);
  });

  it('should handle large coordinate values', () => {
    const coordinate: CoordinateInfo = { x: 10000, y: 20000, soldiers: 100 };
    const node = new KDNode(coordinate);

    expect(node.point.x).toBe(10000);
    expect(node.point.y).toBe(20000);
  });

  it('should create a tree structure', () => {
    const root = new KDNode({ x: 5, y: 10, soldiers: 3 });
    const left = new KDNode({ x: 2, y: 8, soldiers: 1 });
    const right = new KDNode({ x: 8, y: 12, soldiers: 2 });
    const leftLeft = new KDNode({ x: 1, y: 1, soldiers: 5 });

    root.left = left;
    root.right = right;
    left.left = leftLeft;

    expect(root.left?.left?.point.soldiers).toBe(5);
    expect(root.right?.point.x).toBe(8);
  });
});
