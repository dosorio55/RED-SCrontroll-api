import { ProtocolFilterService } from './protocol-filter.service';
import { Protocol } from '../types/protocol.enum';
import Candidate from '../types/candidate.type';

describe('ProtocolFilterService', () => {
  let service: ProtocolFilterService;

  beforeEach(() => {
    service = new ProtocolFilterService();
  });

  const getCandidates = (): Candidate[] => [
    {
      coordinates: [0, 1],
      distance: 1,
      allies: 1,
      enemies: { type: 'soldier', number: 1 },
    },
    {
      coordinates: [0, 2],
      distance: 2,
      allies: 0,
      enemies: { type: 'soldier', number: 1 },
    },
    { coordinates: [0, 3], distance: 3, enemies: { type: 'mech', number: 1 } },
    {
      coordinates: [0, 4],
      distance: 4,
      allies: 0,
      enemies: { type: 'mech', number: 1 },
    },
  ];

  it('AvoidMech excludes mech enemies', () => {
    const candidates = getCandidates();
    const expectedResult = [
      {
        coordinates: [0, 1],
        distance: 1,
        allies: 1,
        enemies: { type: 'soldier', number: 1 },
      },
      {
        coordinates: [0, 2],
        distance: 2,
        allies: 0,
        enemies: { type: 'soldier', number: 1 },
      },
    ];

    const result = service.filterCandidatesByProtocols(candidates, [
      Protocol.AvoidMech,
    ]);

    expect(result).toEqual(expectedResult);
  });

  it('AvoidCrossfire excludes candidates with allies > 0', () => {
    const candidates = getCandidates();
    const expectedResult = [
      {
        coordinates: [0, 2],
        distance: 2,
        allies: 0,
        enemies: { type: 'soldier', number: 1 },
      },
      {
        coordinates: [0, 3],
        distance: 3,
        enemies: { type: 'mech', number: 1 },
      },
      {
        coordinates: [0, 4],
        distance: 4,
        allies: 0,
        enemies: { type: 'mech', number: 1 },
      },
    ];

    const result = service.filterCandidatesByProtocols(candidates, [
      Protocol.AvoidCrossfire,
    ]);

    expect(result).toEqual(expectedResult);
  });

  it('AssistAllies keeps only candidates with allies > 0', () => {
    const candidates = getCandidates();
    const expectedResult = [
      {
        coordinates: [0, 1],
        distance: 1,
        allies: 1,
        enemies: { type: 'soldier', number: 1 },
      },
    ];

    const result = service.filterCandidatesByProtocols(candidates, [
      Protocol.AssistAllies,
    ]);

    expect(result).toEqual(expectedResult);
  });

  it('PrioritizeMech keeps only mech enemies', () => {
    const candidates = getCandidates();
    const expectedResult = [
      {
        coordinates: [0, 3],
        distance: 3,
        enemies: { type: 'mech', number: 1 },
      },
      {
        coordinates: [0, 4],
        distance: 4,
        allies: 0,
        enemies: { type: 'mech', number: 1 },
      },
    ];

    const result = service.filterCandidatesByProtocols(candidates, [
      Protocol.PrioritizeMech,
    ]);

    expect(result).toEqual(expectedResult);
  });

  it('combined AvoidMech and AssistAllies filters correctly', () => {
    const candidates = getCandidates();
    const expectedResult = [
      {
        coordinates: [0, 1],
        distance: 1,
        allies: 1,
        enemies: { type: 'soldier', number: 1 },
      },
    ];

    const result = service.filterCandidatesByProtocols(candidates, [
      Protocol.AvoidMech,
      Protocol.AssistAllies,
    ]);

    expect(result).toEqual(expectedResult);
  });

  it('returns empty array when no candidates match', () => {
    const candidates = getCandidates();
    const result = service.filterCandidatesByProtocols(candidates, [
      Protocol.PrioritizeMech,
      Protocol.AssistAllies,
    ]);

    expect(result).toHaveLength(0);
  });

  it('returns all candidates when no protocols provided', () => {
    const candidates = getCandidates();
    const result = service.filterCandidatesByProtocols(candidates, []);

    expect(result).toHaveLength(4);
    expect(result).toEqual(candidates);
  });

  it('handles empty candidates array', () => {
    const result = service.filterCandidatesByProtocols(
      [],
      [Protocol.AvoidMech],
    );

    expect(result).toHaveLength(0);
  });
});
