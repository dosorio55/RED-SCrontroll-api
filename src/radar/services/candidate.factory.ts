import { Injectable } from '@nestjs/common';
import { ScanRequestDto } from '../dto/scan-request.dto';
import Candidate from '../types/candidate.type';
import { DistanceService } from './distance.service';

@Injectable()
export class CandidateFactory {
  constructor(private readonly distance: DistanceService) {}

  fromScanRequest(dto: ScanRequestDto): Candidate[] {
    const maxDistance = this.distance.getMaxRange();

    return dto.scan.reduce((acc: Candidate[], s) => {
      const coordinates: [number, number] = [s.coordinates.x, s.coordinates.y];
      const distance = this.distance.getDistance(coordinates);

      if (distance > maxDistance) return acc;

      acc.push({ coordinates, distance, allies: s.allies, enemies: s.enemies });

      return acc;
    }, []);
  }
}
