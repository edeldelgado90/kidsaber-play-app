import { validateAnswer } from '../../src/domain/usecases/game/ValidateAnswer';
import { type Question } from '../../src/domain/entities/Question';

const makeQuestion = (overrides: Partial<Question>): Question => ({
  id: 'test-id',
  type: 'option_multiple',
  subject: 'mathematics',
  grade: 3,
  topic: 'test',
  statement: 'Test question',
  correctAnswers: ['B'],
  meta: { difficulty: 'easy', timeLimitMs: 15000, tags: [] },
  ...overrides,
});

describe('validateAnswer — option_multiple', () => {
  it('returns true for the correct option id', () => {
    const q = makeQuestion({ type: 'option_multiple', correctAnswers: ['B'] });
    expect(validateAnswer(q, 'B')).toBe(true);
  });

  it('returns false for an incorrect option id', () => {
    const q = makeQuestion({ type: 'option_multiple', correctAnswers: ['B'] });
    expect(validateAnswer(q, 'A')).toBe(false);
  });

  it('returns false for null answer', () => {
    const q = makeQuestion({ type: 'option_multiple', correctAnswers: ['B'] });
    expect(validateAnswer(q, null)).toBe(false);
  });

  it('returns false for empty string', () => {
    const q = makeQuestion({ type: 'option_multiple', correctAnswers: ['B'] });
    expect(validateAnswer(q, '')).toBe(false);
  });
});

describe('validateAnswer — fill_in_the_blanks', () => {
  it('returns true for the correct option id', () => {
    const q = makeQuestion({ type: 'fill_in_the_blanks', correctAnswers: ['A'] });
    expect(validateAnswer(q, 'A')).toBe(true);
  });

  it('returns false for incorrect', () => {
    const q = makeQuestion({ type: 'fill_in_the_blanks', correctAnswers: ['A'] });
    expect(validateAnswer(q, 'B')).toBe(false);
  });
});

describe('validateAnswer — quick_calculation', () => {
  it('returns true for the correct option id', () => {
    const q = makeQuestion({ type: 'quick_calculation', correctAnswers: ['B'] });
    expect(validateAnswer(q, 'B')).toBe(true);
  });

  it('returns false for an incorrect option id', () => {
    const q = makeQuestion({ type: 'quick_calculation', correctAnswers: ['B'] });
    expect(validateAnswer(q, 'A')).toBe(false);
  });

  it('returns true for the correct numeric answer', () => {
    const q = makeQuestion({ type: 'quick_calculation', correctAnswers: [15] });
    expect(validateAnswer(q, 15)).toBe(true);
  });

  it('returns true when answer is a parseable string number', () => {
    const q = makeQuestion({ type: 'quick_calculation', correctAnswers: [15] });
    expect(validateAnswer(q, '15')).toBe(true);
  });

  it('returns false for wrong number', () => {
    const q = makeQuestion({ type: 'quick_calculation', correctAnswers: [15] });
    expect(validateAnswer(q, 14)).toBe(false);
  });

  it('returns false for non-numeric string', () => {
    const q = makeQuestion({ type: 'quick_calculation', correctAnswers: [15] });
    expect(validateAnswer(q, 'fifteen')).toBe(false);
  });
});

describe('validateAnswer — matching', () => {
  const correctAnswers = [
    { leftId: 'L1', rightId: 'R3' },
    { leftId: 'L2', rightId: 'R1' },
    { leftId: 'L3', rightId: 'R2' },
  ];

  it('returns true for a complete correct matching', () => {
    const q = makeQuestion({ type: 'matching', correctAnswers });
    expect(validateAnswer(q, correctAnswers)).toBe(true);
  });

  it('returns false for incorrect matching', () => {
    const q = makeQuestion({ type: 'matching', correctAnswers });
    const wrong = [
      { leftId: 'L1', rightId: 'R1' },
      { leftId: 'L2', rightId: 'R2' },
      { leftId: 'L3', rightId: 'R3' },
    ];
    expect(validateAnswer(q, wrong)).toBe(false);
  });

  it('returns false for incomplete matching', () => {
    const q = makeQuestion({ type: 'matching', correctAnswers });
    expect(validateAnswer(q, [{ leftId: 'L1', rightId: 'R3' }])).toBe(false);
  });

  it('returns false for non-array', () => {
    const q = makeQuestion({ type: 'matching', correctAnswers });
    expect(validateAnswer(q, 'L1-R3')).toBe(false);
  });
});

describe('validateAnswer — matching with repeated column B labels', () => {
  // Classification questions ("is each word masculine or feminine?") repeat a
  // label in column B. The chips are indistinguishable, so any chip carrying the
  // expected label must count.
  const makeClassification = () =>
    makeQuestion({
      type: 'matching',
      pairs: {
        left: [
          { id: 'L1', text: 'mesa' },
          { id: 'L2', text: 'libro' },
          { id: 'L3', text: 'silla' },
        ],
        right: [
          { id: 'R1', text: 'femenino' },
          { id: 'R2', text: 'masculino' },
          { id: 'R3', text: 'femenino' },
        ],
      },
      correctAnswers: [
        { leftId: 'L1', rightId: 'R1' },
        { leftId: 'L2', rightId: 'R2' },
        { leftId: 'L3', rightId: 'R3' },
      ],
    });

  it('accepts the twin chip carrying the same label', () => {
    const answer = [
      { leftId: 'L1', rightId: 'R3' }, // twin of R1, same label
      { leftId: 'L2', rightId: 'R2' },
      { leftId: 'L3', rightId: 'R1' }, // twin of R3, same label
    ];
    expect(validateAnswer(makeClassification(), answer)).toBe(true);
  });

  it('still rejects a genuinely wrong label', () => {
    const answer = [
      { leftId: 'L1', rightId: 'R2' }, // masculino for "mesa"
      { leftId: 'L2', rightId: 'R1' },
      { leftId: 'L3', rightId: 'R3' },
    ];
    expect(validateAnswer(makeClassification(), answer)).toBe(false);
  });

  it('compares by id when the question carries no pairs', () => {
    const answers = [
      { leftId: 'L1', rightId: 'R3' },
      { leftId: 'L2', rightId: 'R1' },
      { leftId: 'L3', rightId: 'R2' },
    ];
    const q = makeQuestion({ type: 'matching', correctAnswers: answers });
    expect(validateAnswer(q, [...answers])).toBe(true);
    expect(
      validateAnswer(q, [
        { leftId: 'L1', rightId: 'R1' },
        { leftId: 'L2', rightId: 'R3' },
        { leftId: 'L3', rightId: 'R2' },
      ]),
    ).toBe(false);
  });
});
