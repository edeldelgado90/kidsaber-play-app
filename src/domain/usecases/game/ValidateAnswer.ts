import { type Question, type CorrectAnswers, type MatchingAnswer } from '../../entities/Question';

/**
 * Validates the user's answer against the question's `correctAnswers` field.
 * This is the canonical validation logic for all game types.
 *
 * @param question - The question being answered.
 * @param userAnswer - The answer provided by the user (format depends on game type).
 * @returns true if the answer is correct, false otherwise.
 */
export function validateAnswer(question: Question, userAnswer: unknown): boolean {
  const { correctAnswers, type } = question;

  switch (type) {
    case 'option_multiple':
    case 'fill_in_the_blanks':
      // User selects an option ID (string); correctAnswers is string[]
      return isStringArrayAnswer(correctAnswers, userAnswer);

    case 'quick_calculation':
      // API may send option IDs (string[]) or numeric results (number[])
      if (correctAnswers.length > 0 && typeof correctAnswers[0] === 'string') {
        return isStringArrayAnswer(correctAnswers, userAnswer);
      }
      return isNumericAnswer(correctAnswers, userAnswer);

    case 'matching':
      // User provides an array of { leftId, rightId } pairs
      return isMatchingAnswer(correctAnswers, userAnswer, question);

    default:
      return false;
  }
}

function isStringArrayAnswer(correctAnswers: CorrectAnswers, userAnswer: unknown): boolean {
  if (typeof userAnswer !== 'string') return false;
  const correct = correctAnswers as string[];
  return correct.includes(userAnswer);
}

function isNumericAnswer(correctAnswers: CorrectAnswers, userAnswer: unknown): boolean {
  const numAnswer = typeof userAnswer === 'string' ? parseFloat(userAnswer) : userAnswer;
  if (typeof numAnswer !== 'number' || isNaN(numAnswer)) return false;
  const correct = correctAnswers as number[];
  return correct.some(c => c === numAnswer);
}

function isMatchingAnswer(
  correctAnswers: CorrectAnswers,
  userAnswer: unknown,
  question: Question,
): boolean {
  if (!Array.isArray(userAnswer)) return false;
  const correct = correctAnswers as MatchingAnswer[];
  const user = userAnswer as MatchingAnswer[];

  if (user.length !== correct.length) return false;

  // Classification questions repeat a label in column B ("masculino" twice, say).
  // Those chips are indistinguishable on screen, so accept any chip carrying the
  // expected label rather than the one specific ID the question happens to name.
  const labelOf = buildRightLabelLookup(question);

  return correct.every(ca =>
    user.some(ua => ua.leftId === ca.leftId && labelOf(ua.rightId) === labelOf(ca.rightId)),
  );
}

/**
 * Maps a column B item ID to its normalised label, falling back to the ID itself
 * when the question carries no pairs (so validation stays strict).
 */
function buildRightLabelLookup(question: Question): (rightId: string) => string {
  const right = question.pairs?.right;
  if (!right) return (rightId: string) => rightId;

  const labels = new Map<string, string>();
  for (const item of right) {
    labels.set(item.id, item.text.trim().toLowerCase());
  }
  return (rightId: string) => labels.get(rightId) ?? rightId;
}
