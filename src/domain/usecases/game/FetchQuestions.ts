import { type Question, type Subject, type GameType } from '../../entities/Question';
import { type IQuestionsService } from '../../ports/IQuestionsService';
import { DEFAULT_QUESTION_COUNT } from '../../entities/GameSession';

interface FetchQuestionsInput {
  subject: Subject;
  grade: number;
  gameType: GameType;
  count?: number;
}

/**
 * Fetches a batch of questions for a game session from the questions API.
 */
export async function fetchQuestions(
  service: IQuestionsService,
  input: FetchQuestionsInput,
): Promise<Question[]> {
  const questions = await service.fetchQuestions({
    subject: input.subject,
    grade: input.grade,
    type: input.gameType,
    count: input.count ?? DEFAULT_QUESTION_COUNT,
  });

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('No se pudieron cargar las preguntas. Inténtalo de nuevo.');
  }

  return questions;
}
