import { Injectable } from '@nestjs/common';
import Candidate from '../types/candidate.type';
import { Protocol } from '../types/protocol.enum';
import { ProtocolStrategy } from './protocol-strategy';

@Injectable()
export class ClosestEnemiesStrategy implements ProtocolStrategy {
  readonly key = Protocol.ClosestEnemies;

  apply(candidates: Candidate[]): Candidate[] {
    const result = candidates.slice().sort((a, b) => a.distance - b.distance);

    return result;
  }
}
