import { Injectable } from '@nestjs/common';
import RouteRequestDto from './dto/route-request.dto';

interface CoordinateInfo {
  x: number;
  y: number;
  soldiers: number;
}

class KDNode {
  point: CoordinateInfo;
  left: KDNode | null = null;
  right: KDNode | null = null;

  constructor(point: CoordinateInfo) {
    this.point = point;
  }
}

class KDTree {
  private root: KDNode | null = null;

  constructor(points: RouteRequestDto['radar']) {
    this.root = this.buildTree(points, 0);
  }

  private buildTree(
    points: RouteRequestDto['radar'],
    depth: number,
  ): KDNode | null {
    if (points.length === 0) return null;

    const axis = depth % 2;
    points.sort((a, b) => (axis === 0 ? a[0] - b[0] : a[1] - b[1]));

    const median = Math.floor(points.length / 2);
    const node = new KDNode({
      x: points[median][0],
      y: points[median][1],
      soldiers: points[median][2],
    });

    node.left = this.buildTree(points.slice(0, median), depth + 1);
    node.right = this.buildTree(points.slice(median + 1), depth + 1);

    return node;
  }

  private distanceSquared(p1: CoordinateInfo, p2: CoordinateInfo): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  }

  findNearest(
    target: CoordinateInfo,
    excludePoint?: CoordinateInfo[],
  ): CoordinateInfo | null {
    if (!this.root) return null;

    const best: { point: CoordinateInfo; distance: number } = {
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
    target: CoordinateInfo,
    depth: number,
    best: { point: CoordinateInfo; distance: number },
    excludePoint?: CoordinateInfo[],
  ): void {
    if (!node) return;

    const isExcluded = excludePoint && excludePoint.includes(node.point);

    if (!isExcluded) {
      const distance = this.distanceSquared(target, node.point);
      if (distance < best.distance) {
        best.point = node.point;
        best.distance = distance;
      } else if (
        distance === best.distance &&
        (node.point.x !== best.point.x || node.point.y !== best.point.y)
      ) {
        const enemyCount = node.point.soldiers;
        const bestEnemyCount = best.point.soldiers;

        if (enemyCount > bestEnemyCount) {
          best.point = node.point;
          best.distance = distance;
        }
      }
    }

    const axis = depth % 2;
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

  findChain(start: CoordinateInfo, length: number): CoordinateInfo[] {
    const chain: CoordinateInfo[] = [];
    let currentPosition = start;

    for (let i = 0; i < length; i++) {
      const nextPosition = this.findNearest(currentPosition, chain);

      if (!nextPosition) break;

      chain.push(nextPosition);
      currentPosition = nextPosition;
    }

    return chain;
  }
}

@Injectable()
export class RouteService {
  constructor() {}

  post(radarAndPosition: RouteRequestDto): number[][] {
    const kdTree = new KDTree(radarAndPosition.radar);

    const enemiesChain = kdTree.findChain(
      {
        x: radarAndPosition.position[0],
        y: radarAndPosition.position[1],
        soldiers: 0,
      },
      radarAndPosition.radar.length,
    );

    return enemiesChain.map((point) => [point.x, point.y]);
  }
}
