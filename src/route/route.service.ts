import { Injectable } from '@nestjs/common';
import RouteRequestDto from './dto/route-request.dto';

class KDNode {
  point: Point;
  left: KDNode | null = null;
  right: KDNode | null = null;

  constructor(point: Point) {
    this.point = point;
  }
}

class KDTree {
  private root: KDNode | null = null;
  private k: number = 2;

  constructor(points: Point[]) {
    this.root = this.buildTree(points, 0);
  }

  private buildTree(points: Point[], depth: number): KDNode | null {
    if (points.length === 0) return null;

    const axis = depth % this.k;
    points.sort((a, b) => (axis === 0 ? a.x - b.x : a.y - b.y));

    const median = Math.floor(points.length / 2);
    const node = new KDNode(points[median]);

    node.left = this.buildTree(points.slice(0, median), depth + 1);
    node.right = this.buildTree(points.slice(median + 1), depth + 1);

    return node;
  }

  private distanceSquared(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  }

  findNearest(target: Point, excludePoint?: Point[]): Point | null {
    if (!this.root) return null;

    const best: { point: Point; distance: number } = {
      point: this.root.point,
      distance: this.distanceSquared(target, this.root.point),
    };

    if (excludePoint && excludePoint.includes(best.point)) {
      best.distance = Infinity;
    }

    this.searchNearest(this.root, target, 0, best, excludePoint);
    return best.point;
  }

  private searchNearest(
    node: KDNode | null,
    target: Point,
    depth: number,
    best: { point: Point; distance: number },
    excludePoint?: Point[],
  ): void {
    if (!node) return;

    const isExcluded = excludePoint && excludePoint.includes(node.point);

    if (!isExcluded) {
      const distance = this.distanceSquared(target, node.point);
      if (distance < best.distance) {
        best.point = node.point;
        best.distance = distance;
      }
    }

    const axis = depth % this.k;
    const targetValue = axis === 0 ? target.x : target.y;
    const nodeValue = axis === 0 ? node.point.x : node.point.y;

    const first = targetValue < nodeValue ? node.left : node.right;
    const second = targetValue < nodeValue ? node.right : node.left;

    this.searchNearest(first, target, depth + 1, best, excludePoint);

    const axisDistance = targetValue - nodeValue;
    if (axisDistance * axisDistance < best.distance) {
      this.searchNearest(second, target, depth + 1, best, excludePoint);
    }
  }

  findChain(start: Point, length: number): Point[] {
    const chain: Point[] = [];
    let currentPosition = start;

    for (let i = 0; i < length; i++) {
      const next = this.findNearest(currentPosition, chain);

      if (!next) break;

      chain.push(next);
      currentPosition = next;
    }

    return chain;
  }
}

interface Point {
  x: number;
  y: number;
}

// const points2: Point[] = [
//   { x: 2, y: 3 },
//   { x: 4, y: 7 },
//   { x: 5, y: 4 },
//   { x: 7, y: 2 },
//   { x: 8, y: 1 },
//   { x: 9, y: 6 },
//   { x: 1, y: 5 },
//   { x: 6, y: 8 },
// ];

// Ejemplo de uso
// const points: Point[] = [
//   { x: 2, y: 3 },
//   { x: 5, y: 4 },
//   { x: 9, y: 6 },
//   { x: 4, y: 7 },
//   { x: 8, y: 1 },
//   { x: 7, y: 2 },
// ];
// const points2: Point[] = [
//   { x: 479, y: 449 },
//   { x: 207, y: 313 },
//   { x: 70, y: 721 },
//   { x: 343, y: 858 },
//   { x: 615, y: 40 },
//   { x: 751, y: 177 },
//   { x: 888, y: 585 },
// ];

// const target = { x: 438, y: 681 };

@Injectable()
export class RouteService {
  constructor() {}

  post(radarAndPosition: RouteRequestDto): boolean {
    const mappedRadar = radarAndPosition.radar.map((row) => {
      return { x: row[0], y: row[1] };
    });

    const kdTree = new KDTree(mappedRadar);

    const nearest = kdTree.findChain(
      { x: radarAndPosition.position[0], y: radarAndPosition.position[1] },
      mappedRadar.length,
    );

    console.log(nearest);

    return true;
  }
}
