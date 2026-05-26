import { type Subject, type GameType, type Question } from './Question';

/**
 * Represents a single game session — the in-progress or completed state of a play round.
 */
export interface GameSessionAnswer {
  questionId: string;
  isCorrect: boolean;
}

export interface GameSession {
  sessionId: string;
  subject: Subject;
  gameType: GameType;
  grade: number;
  questions: Question[];
  answers: GameSessionAnswer[];
  starEarned: boolean;
  startedAt: string; // ISO 8601
  finishedAt?: string; // ISO 8601 — set when session ends
}

/** The minimum accuracy rate to earn a star (80%). */
export const STAR_THRESHOLD = 0.8;

/** Default number of questions per session. The API can override this. */
export const DEFAULT_QUESTION_COUNT = 10;

/**
 * Calculates whether a star is earned given the number of correct answers
 * and the total number of questions.
 */
export function calculateStarEarned(correctCount: number, totalCount: number): boolean {
  if (totalCount === 0) return false;
  return correctCount / totalCount > STAR_THRESHOLD;
}

/**
 * Counts correct answers from a list of session answers.
 */
export function countCorrectAnswers(answers: GameSessionAnswer[]): number {
  return answers.filter(a => a.isCorrect).length;
}
