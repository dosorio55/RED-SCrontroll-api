import { Injectable } from '@nestjs/common';
import Candidate from '../types/candidate.type';
import { Protocol } from '../types/protocol.enum';

@Injectable()
export class ProtocolFilterService {
  filterCandidatesByProtocols(
    candidates: Candidate[],
    filteringProtocols: Protocol[],
  ): Candidate[] {
    const result: Candidate[] = [];

    for (const candidate of candidates) {
      let ok = true;

      for (const protocol of filteringProtocols) {
        switch (protocol) {
          case Protocol.AvoidMech:
            if (candidate.enemies?.type === 'mech') {
              ok = false;
              break;
            }
            break;
          case Protocol.AvoidCrossfire:
            if (candidate.allies && candidate.allies > 0) {
              ok = false;
              break;
            }
            break;
          case Protocol.AssistAllies:
            if (!candidate.allies || candidate.allies === 0) {
              ok = false;
              break;
            }
            break;
          case Protocol.PrioritizeMech:
            if (candidate.enemies?.type !== 'mech') {
              ok = false;
              break;
            }
            break;
        }

        if (!ok) break;
      }

      if (ok) result.push(candidate);
    }
    return result;
  }
}
