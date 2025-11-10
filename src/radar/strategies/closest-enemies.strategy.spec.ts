import Candidate from '../types/candidate.type';
import { ClosestEnemiesStrategy } from './closest-enemies.strategy';

describe('ClosestEnemiesStrategy', () => {
  let strategy: ClosestEnemiesStrategy;

  beforeEach(() => {
    strategy = new ClosestEnemiesStrategy();
  });

  it('sorts candidates ascending by distance', () => {
    const input: Candidate[] = [
      { coordinates: [10, 10], distance: 10 },
      { coordinates: [5, 5], distance: 5 },
      { coordinates: [7, 7], distance: 7 },
    ];
    const expectedResult: Candidate[] = [
      { coordinates: [5, 5], distance: 5 },
      { coordinates: [7, 7], distance: 7 },
      { coordinates: [10, 10], distance: 10 },
    ];

    const result = strategy.apply(input);

    expect(result).toEqual(expectedResult);
  });

  it('does not mutate input array', () => {
    const input: Candidate[] = [
      { coordinates: [10, 10], distance: 10 },
      { coordinates: [5, 5], distance: 5 },
    ];
    const inputCopy = JSON.parse(JSON.stringify(input));
    strategy.apply(input);

    expect(input).toEqual(inputCopy);
  });

  it('handles empty array', () => {
    const expectedResult: Candidate[] = [];

    const result = strategy.apply([]);

    expect(result).toEqual(expectedResult);
  });

  it('handles single candidate', () => {
    const input: Candidate[] = [{ coordinates: [3, 3], distance: 3 }];
    const expectedResult: Candidate[] = [{ coordinates: [3, 3], distance: 3 }];

    const result = strategy.apply(input);

    expect(result).toEqual(expectedResult);
  });

  it('handles candidates with equal distance', () => {
    const input: Candidate[] = [
      { coordinates: [1, 1], distance: 5 },
      { coordinates: [2, 2], distance: 5 },
      { coordinates: [3, 3], distance: 5 },
    ];
    const expectedResult: Candidate[] = [
      { coordinates: [1, 1], distance: 5 },
      { coordinates: [2, 2], distance: 5 },
      { coordinates: [3, 3], distance: 5 },
    ];

    const result = strategy.apply(input);

    expect(result).toEqual(expectedResult);
  });

  it('has correct protocol key', () => {
    expect(strategy.key).toBe('closest-enemies');
  });
});
