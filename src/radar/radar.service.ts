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
    console.time('time to process scan');
    const candidates = this.buildCandidatesAndFilterRange(scanRequest);

    const filteredCandidates = this.filterByProtocolVersion2(
      candidates,
      scanRequest.protocols,
    );

    const sortedCandidates = this.sortCandidatesByProtocolDistance(
      filteredCandidates,
      scanRequest.protocols,
    );

    console.timeEnd('time to process scan');
    return sortedCandidates;
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

  private filterByProtocolVersion2(
    candidates: Candidate[],
    protocols: Protocol[],
  ): Candidate[] {
    const protocolsSet = new Set(
      this.getProtocolPrioritiesOrder().filter((orderedProtocol) => {
        return protocols.includes(orderedProtocol);
      }),
    );

    const finalCandidates = candidates.filter((candidate) => {
      for (const protocol of protocolsSet) {
        switch (protocol) {
          case Protocol.AvoidMech:
            if (candidate.enemies?.type === 'mech') return false;
            break;

          case Protocol.AvoidCrossfire:
            if (candidate.allies && candidate.allies > 0) return false;
            break;

          case Protocol.AssistAllies:
            if (!candidate.allies || candidate.allies === 0) return false;
            break;

          case Protocol.PrioritizeMech:
            if (candidate.enemies?.type !== 'mech') return false;
            break;

          default:
            break;
        }
      }
      return true;
    });

    return finalCandidates;
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

    const finalCandidates = candidates.filter((candidate) => {
      for (const protocol of protocolsSet) {
        switch (protocol) {
          case Protocol.AvoidMech:
            if (candidate.enemies?.type === 'mech') return false;
            break;

          case Protocol.AvoidCrossfire:
            if (candidate.allies && candidate.allies > 0) return false;
            break;

          case Protocol.AssistAllies:
            if (!candidate.allies || candidate.allies === 0) return false;
            break;

          case Protocol.PrioritizeMech:
            if (candidate.enemies?.type !== 'mech') return false;
            break;

          default:
            break;
        }
      }

      return true;
    });

    return finalCandidates;
  }

  private sortCandidatesByProtocolDistance(
    candidates: Candidate[],
    protocols: Protocol[],
  ): Candidate[] {
    const ordered = this.getProtocolPrioritiesOrder().filter((p) =>
      protocols.includes(p),
    );

    const satisfies = (c: Candidate, p: Protocol): boolean => {
      switch (p) {
        case Protocol.AvoidMech:
          return c.enemies?.type !== 'mech';
        case Protocol.AvoidCrossfire:
          return !c.allies || c.allies === 0;
        case Protocol.AssistAllies:
          return !!c.allies && c.allies > 0;
        case Protocol.PrioritizeMech:
          return c.enemies?.type === 'mech';
        default:
          return true;
      }
    };

    const byPriorityThenDistance = (a: Candidate, b: Candidate): number => {
      for (const p of ordered) {
        const sa = satisfies(a, p) ? 1 : 0;
        const sb = satisfies(b, p) ? 1 : 0;
        if (sa !== sb) return sb - sa;
      }

      if (protocols.includes(Protocol.ClosestEnemies)) {
        return a.distance - b.distance;
      }
      if (protocols.includes(Protocol.FurthestEnemies)) {
        return b.distance - a.distance;
      }
      return 0;
    };

    return candidates.slice().sort(byPriorityThenDistance);
  }

  private getProtocolPrioritiesOrder(): Protocol[] {
    return [
      Protocol.AssistAllies,
      Protocol.AvoidCrossfire,
      Protocol.AvoidMech,
      Protocol.PrioritizeMech,
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
