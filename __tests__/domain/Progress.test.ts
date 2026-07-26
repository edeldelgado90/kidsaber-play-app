import {
  createEmptyProfileProgress,
  getStarsForSubject,
  getStarsForGameType,
  getTotalStars,
} from '../../src/domain/entities/Progress';
import type { ProfileProgress } from '../../src/domain/entities/Progress';

describe('createEmptyProfileProgress', () => {
  it('returns empty stars maps and null lastSession', () => {
    const p = createEmptyProfileProgress();
    expect(p.starsBySubject).toEqual({});
    expect(p.starsByGameType).toEqual({});
    expect(p.lastSession).toBeNull();
  });
});

describe('getStarsForSubject', () => {
  it('returns 0 when subject not present', () => {
    const p = createEmptyProfileProgress();
    expect(getStarsForSubject(p, 'mathematics')).toBe(0);
  });

  it('returns the stored star count', () => {
    const p: ProfileProgress = {
      starsBySubject: { mathematics: 3 },
      starsByGameType: {},
      lastSession: null,
    };
    expect(getStarsForSubject(p, 'mathematics')).toBe(3);
  });
});

describe('getStarsForGameType', () => {
  it('returns 0 when game type not present', () => {
    const p = createEmptyProfileProgress();
    expect(getStarsForGameType(p, 'option_multiple')).toBe(0);
  });

  it('returns the stored star count', () => {
    const p: ProfileProgress = {
      starsBySubject: {},
      starsByGameType: { matching: 5 },
      lastSession: null,
    };
    expect(getStarsForGameType(p, 'matching')).toBe(5);
  });
});

describe('getTotalStars', () => {
  it('returns 0 for empty progress', () => {
    expect(getTotalStars(createEmptyProfileProgress())).toBe(0);
  });

  it('sums all subject stars', () => {
    const p: ProfileProgress = {
      starsBySubject: { mathematics: 2, language: 3, science: 1 },
      starsByGameType: {},
      lastSession: null,
    };
    expect(getTotalStars(p)).toBe(6);
  });

  it('handles undefined values in the map gracefully', () => {
    const p: ProfileProgress = {
      starsBySubject: { mathematics: 4 },
      starsByGameType: {},
      lastSession: null,
    };
    expect(getTotalStars(p)).toBe(4);
  });
});
