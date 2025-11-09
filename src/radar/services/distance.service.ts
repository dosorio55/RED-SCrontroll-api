import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DistanceService {
  constructor(private readonly config: ConfigService) {}

  getDistance([x, y]: [number, number]): number {
    return Math.hypot(x, y);
  }

  getMaxRange(): number {
    const val = this.config.get<number>('MAX_DROID_DISTANCE_RANGE');

    return typeof val === 'number' && !Number.isNaN(val) ? val : 100;
  }
}
