import { Injectable } from '@nestjs/common';
import { ScanRequestDto } from './dto/scan-request.dto';
import { Protocol } from './types/protocol.enum';
import { ConfigService } from '@nestjs/config';
import Candidate from './types/candidate.type';

@Injectable()
export class RadarService {
  constructor(private readonly config: ConfigService) {}

  get(): string {
    return 'The radar is set and ready to LAUNCH!';
  }

  post(scanRequest: ScanRequestDto): Candidate[] {
    const candidates = this.buildCandidatesAndFilterRange(scanRequest);

    const filteredCandidates = this.filterByProtocol(
      candidates,
      scanRequest.protocols,
    );

    return filteredCandidates;
  }

  private buildCandidatesAndFilterRange(
    scanRequest: ScanRequestDto,
  ): Candidate[] {
    const candidates = scanRequest.scan.reduce((acc: Candidate[], scan) => {
      const distance = this.getDistanceToCoordinate([
        scan.coordinates.x,
        scan.coordinates.y,
      ]);

      if (distance > this.getMaxRange()) return acc;

      acc.push({
        coordinates: [scan.coordinates.x, scan.coordinates.y],
        distance,
        allies: scan.allies,
        enemies: scan.enemies,
      });

      return acc;
    }, []);

    return candidates;
  }

  private filterByProtocol(
    candidates: Candidate[],
    protocols: Protocol[],
  ): Candidate[] {
    const protocolsSet = new Set(
      this.getProtocolPrioritiesOrder().filter((orderedProtocol) => {
        return protocols.includes(orderedProtocol);
      }),
    );

    const finalCandidates = candidates.reduce((acc: Candidate[], candidate) => {
      protocolsSet.forEach((protocol) => {
        switch (protocol) {
          case Protocol.AvoidMech:
            if (candidate.enemies?.type !== 'mech') {
              acc.push(candidate);
            }
            break;
          case Protocol.AvoidCrossfire:
            if (!candidate.allies || candidate.allies === 0) {
              acc.push(candidate);
            }
            break;
          case Protocol.AssistAllies:
            if (candidate.allies && candidate.allies > 0) {
              acc.push(candidate);
            }
            break;
          case Protocol.PrioritizeMech:
            if (candidate.enemies?.type === 'mech') {
              acc.push(candidate);
            }
            break;
          case Protocol.ClosestEnemies:
            if (candidate.enemies?.number && candidate.enemies?.number > 0) {
              acc.push(candidate);
            }
            break;
          case Protocol.FurthestEnemies:
            if (candidate.enemies?.number && candidate.enemies?.number > 0) {
              acc.push(candidate);
            }
            break;
        }
      });
      return acc;
    }, []);

    return finalCandidates;
  }

  private getProtocolPrioritiesOrder(): Protocol[] {
    return [
      Protocol.AvoidMech,
      Protocol.AvoidCrossfire,
      Protocol.AssistAllies,
      Protocol.PrioritizeMech,
      Protocol.ClosestEnemies,
      Protocol.FurthestEnemies,
    ];
  }

  private getDistanceToCoordinate(points: [number, number]): number {
    return Math.hypot(points[0], points[1]);
  }

  private getMaxRange(): number {
    const val = this.config.get<number>('MAX_DROID_DISTANCE_RANGE');
    return typeof val === 'number' && !Number.isNaN(val) ? val : 100;
  }
}
