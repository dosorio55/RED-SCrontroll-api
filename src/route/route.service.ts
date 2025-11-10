import { Injectable } from '@nestjs/common';
import RouteRequestDto from './dto/route-request.dto';

interface Point {
  x: number;
  y: number;
}

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

  constructor(points: Point[]) {
    this.root = this.buildTree(points, 0);
  }

  private buildTree(points: Point[], depth: number): KDNode | null {
    if (points.length === 0) return null;

    const axis = depth % 2;
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

  findNearest(
    target: Point,
    enemies: Record<string, EnemyInformation[]>,
    excludePoint?: Point[],
  ): Point | null {
    if (!this.root) return null;

    const best: { point: Point; distance: number } = {
      point: this.root.point,
      distance: this.distanceSquared(target, this.root.point),
    };

    if (excludePoint && excludePoint.includes(best.point)) {
      best.distance = Infinity;
    }

    this.searchNearest(this.root, target, 0, best, enemies, excludePoint);
    return best.point;
  }

  private searchNearest(
    node: KDNode | null,
    target: Point,
    depth: number,
    best: { point: Point; distance: number },
    enemies: Record<string, EnemyInformation[]>,
    excludePoint?: Point[],
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
        const enemyCount =
          enemies[`${node.point.x}-${node.point.y}`]?.[0].soldiers || 0;
        const bestEnemyCount =
          enemies[`${best.point.x}-${best.point.y}`]?.[0].soldiers || 0;

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

    this.searchNearest(first, target, depth + 1, best, enemies, excludePoint);

    const axisDistance = targetValue - nodeValue;
    if (axisDistance * axisDistance < best.distance) {
      this.searchNearest(
        second,
        target,
        depth + 1,
        best,
        enemies,
        excludePoint,
      );
    }
  }

  findChain(
    start: Point,
    length: number,
    enemies: Record<string, EnemyInformation[]>,
  ): Point[] {
    const chain: Point[] = [];
    let currentPosition = start;

    for (let i = 0; i < length; i++) {
      const nextPosition = this.findNearest(currentPosition, enemies, chain);

      if (!nextPosition) break;

      chain.push(nextPosition);
      currentPosition = nextPosition;
    }

    return chain;
  }
}

interface EnemyInformation {
  soldiers: number;
}

@Injectable()
export class RouteService {
  constructor() {}

  post(radarAndPosition: RouteRequestDto): number[][] {
    const { mappedRadar, enemies } = this.deleteDuplicatesAndGetSoldiersAndMap(
      radarAndPosition.radar,
    );

    const kdTree = new KDTree(mappedRadar);

    const enemiesChain = kdTree.findChain(
      { x: radarAndPosition.position[0], y: radarAndPosition.position[1] },
      mappedRadar.length,
      enemies,
    );

    return enemiesChain.map((point) => [point.x, point.y]);
  }

  private deleteDuplicatesAndGetSoldiersAndMap(
    radar: RouteRequestDto['radar'],
  ): {
    enemies: Record<string, EnemyInformation[]>;
    mappedRadar: Point[];
  } {
    const enemiesMap: Record<string, EnemyInformation[]> = {};
    const uniquePositions = new Set<string>();

    for (const [x, y, soldiers] of radar) {
      const key = `${x}-${y}`;

      if (!enemiesMap[key]) {
        enemiesMap[key] = [];
      }

      enemiesMap[key].push({ soldiers });
      uniquePositions.add(key);
    }

    for (const key in enemiesMap) {
      enemiesMap[key].sort((a, b) => b.soldiers - a.soldiers);
    }

    const mappedRadar: Point[] = Array.from(uniquePositions).map((key) => {
      const [x, y] = key.split('-').map(Number);
      return { x, y };
    });

    return { enemies: enemiesMap, mappedRadar };
  }
}
