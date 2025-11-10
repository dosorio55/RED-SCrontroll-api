import { ProtocolOrderResolver } from './protocol-order.resolver';
import { Protocol } from '../types/protocol.enum';

describe('ProtocolOrderResolver', () => {
  let resolver: ProtocolOrderResolver;

  beforeEach(() => {
    resolver = new ProtocolOrderResolver();
  });

  it('resolveFilteringProtocols returns ordered subset', () => {
    const input = [
      Protocol.AvoidCrossfire,
      Protocol.PrioritizeMech,
      Protocol.AssistAllies,
    ];
    const expectedOutput = [
      Protocol.AssistAllies,
      Protocol.AvoidCrossfire,
      Protocol.PrioritizeMech,
    ];

    const result = resolver.resolveFilteringProtocols(input);

    expect(result).toEqual(expectedOutput);
  });

  it('resolveFilteringProtocols orders and excludes sorting protocols', () => {
    const input = [
      Protocol.AvoidCrossfire,
      Protocol.PrioritizeMech,
      Protocol.AssistAllies,
      Protocol.ClosestEnemies,
    ];
    const expectedOutput = [
      Protocol.AssistAllies,
      Protocol.AvoidCrossfire,
      Protocol.PrioritizeMech,
    ];

    const result = resolver.resolveFilteringProtocols(input);

    expect(result).toEqual(expectedOutput);
  });

  it('resolveSortingProtocols returns ordered subset', () => {
    const input = [
      Protocol.AssistAllies,
      Protocol.AvoidMech,
      Protocol.ClosestEnemies,
    ];
    const expectedOutput = [Protocol.ClosestEnemies];

    const result = resolver.resolveSortingProtocols(input);

    expect(result).toEqual(expectedOutput);
  });

  it('resolveSortingProtocols returns empty when no sorting protocols in input', () => {
    const input = [Protocol.AvoidMech, Protocol.AssistAllies];
    const result = resolver.resolveSortingProtocols(input);

    expect(result).toEqual([]);
  });
});
