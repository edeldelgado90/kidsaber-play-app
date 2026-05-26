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
}
