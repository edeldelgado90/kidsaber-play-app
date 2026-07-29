import { type Question, type Subject, type GameType } from '../entities/Question';

export interface FetchQuestionsParams {
  subject: Subject;
  grade: number;
  type: GameType;
  count?: number;
}

/**
 * Port (interface) for the questions API service.
 * The app never calls AI providers directly — only this service.
 */
export interface IQuestionsService {
  fetchQuestions(params: FetchQuestionsParams): Promise<Question[]>;

  /**
   * Flags a question as wrong so a human can review it.
   *
   * Only the id travels: the API reads the question's subject, grade and
   * statement from its own database, so nothing a child types or sees can end
   * up in the review queue.
   */
  reportQuestion(questionId: string): Promise<void>;
}
