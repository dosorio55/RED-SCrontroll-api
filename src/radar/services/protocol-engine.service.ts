import { Inject, Injectable } from '@nestjs/common';
import Candidate from '../types/candidate.type';
import { Protocol } from '../types/protocol.enum';
import { ProtocolOrderResolver } from './protocol-order.resolver';
import { ProtocolStrategy } from '../strategies/protocol-strategy';
import { PROTOCOL_STRATEGY_MAP } from '../strategies/strategy.tokens';
import { ProtocolFilterService } from './protocol-filter.service';

@Injectable()
export class ProtocolEngineService {
  constructor(
    private readonly resolver: ProtocolOrderResolver,
    private readonly filterService: ProtocolFilterService,
    @Inject(PROTOCOL_STRATEGY_MAP)
    private readonly strategies: Record<Protocol, ProtocolStrategy>,
  ) {}

  run(protocols: Protocol[], candidates: Candidate[]): Candidate[] {
    const filteringProtocols =
      this.resolver.resolveFilteringProtocols(protocols);
    const filteredCandidates = this.filterService.filterCandidatesByProtocols(
      candidates,
      filteringProtocols,
    );

    const sortedProtocols = this.resolver.resolveSortingProtocols(protocols);

    for (const protocol of sortedProtocols) {
      const strategy = this.strategies[protocol];

      return strategy ? strategy.apply(filteredCandidates) : filteredCandidates;
    }

    return filteredCandidates;
  }
}
