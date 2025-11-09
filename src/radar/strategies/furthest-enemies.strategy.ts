import { Injectable } from '@nestjs/common';
import Candidate from '../types/candidate.type';
import { Protocol } from '../types/protocol.enum';
import { ProtocolStrategy } from './protocol-strategy';

@Injectable()
export class FurthestEnemiesStrategy implements ProtocolStrategy {
  readonly key = Protocol.FurthestEnemies;

  apply(candidates: Candidate[]): Candidate[] {
    const result = candidates.slice().sort((a, b) => b.distance - a.distance);

    return result;
  }
}
