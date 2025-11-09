import { Injectable } from '@nestjs/common';
import { Protocol } from '../types/protocol.enum';

@Injectable()
export class ProtocolOrderResolver {
  private readonly filteringProtocols: Protocol[] = [
    Protocol.AssistAllies,
    Protocol.AvoidCrossfire,
    Protocol.AvoidMech,
    Protocol.PrioritizeMech,
  ];
  private readonly sortingProtocols: Protocol[] = [
    Protocol.ClosestEnemies,
    Protocol.FurthestEnemies,
  ];

  resolveFilteringProtocols(protocols: Protocol[]): Protocol[] {
    return this.filteringProtocols.filter((p) => protocols.includes(p));
  }

  resolveSortingProtocols(protocols: Protocol[]): Protocol[] {
    return this.sortingProtocols.filter((p) => protocols.includes(p));
  }
}
