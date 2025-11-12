import { Injectable } from '@nestjs/common';
import RouteRequestDto from './dto/route-request.dto';
import { KDTree } from './services/kd-tree';

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
