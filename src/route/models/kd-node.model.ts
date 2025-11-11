import { CoordinateInfo } from '../types/coordinate.type';

export class KDNode {
  point: CoordinateInfo;
  left: KDNode | null = null;
  right: KDNode | null = null;

  constructor(point: CoordinateInfo) {
    this.point = point;
  }
}
