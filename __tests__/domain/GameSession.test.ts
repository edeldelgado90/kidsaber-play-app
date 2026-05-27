import {
  calculateStarEarned,
  countCorrectAnswers,
  STAR_THRESHOLD,
} from '../../src/domain/entities/GameSession';

describe('calculateStarEarned', () => {
  it('returns true when correctCount > 80% of total', () => {
    expect(calculateStarEarned(9, 10)).toBe(true); // 90%
    expect(calculateStarEarned(10, 10)).toBe(true); // 100%
    expect(calculateStarEarned(9, 10)).toBe(true);
  });

  it('returns true when correctCount === 80% (threshold is inclusive >=)', () => {
    // 80% exactly satisfies >= 0.8
    expect(calculateStarEarned(8, 10)).toBe(true);
  });

  it('returns false when correctCount < 80%', () => {
    expect(calculateStarEarned(7, 10)).toBe(false);
    expect(calculateStarEarned(0, 10)).toBe(false);
    expect(calculateStarEarned(1, 10)).toBe(false);
  });

  it('returns false for 0 total', () => {
    expect(calculateStarEarned(0, 0)).toBe(false);
  });

  it('uses 0.8 as the threshold', () => {
    expect(STAR_THRESHOLD).toBe(0.8);
  });
});

describe('countCorrectAnswers', () => {
  it('counts only correct answers', () => {
    const answers = [
      { questionId: '1', isCorrect: true },
      { questionId: '2', isCorrect: false },
      { questionId: '3', isCorrect: true },
      { questionId: '4', isCorrect: true },
    ];
    expect(countCorrectAnswers(answers)).toBe(3);
  });

  it('returns 0 for empty array', () => {
    expect(countCorrectAnswers([])).toBe(0);
  });

  it('returns 0 when all wrong', () => {
    const answers = [
      { questionId: '1', isCorrect: false },
      { questionId: '2', isCorrect: false },
    ];
    expect(countCorrectAnswers(answers)).toBe(0);
  });
});
