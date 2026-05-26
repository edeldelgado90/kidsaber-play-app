import { type IQuestionsService, type FetchQuestionsParams } from '../../domain/ports/IQuestionsService';
import { type Question } from '../../domain/entities/Question';
import { fetchQuestionsFromApi } from '../api/questionsApi';

/**
 * Concrete implementation of IQuestionsService using the KidSaber REST API.
 * The app never calls AI providers directly — only this service via the backend.
 */
export class QuestionsApiService implements IQuestionsService {
  constructor(private readonly baseUrl: string) {}

  async fetchQuestions(params: FetchQuestionsParams): Promise<Question[]> {
    return fetchQuestionsFromApi(this.baseUrl, {
      subject: params.subject,
      grade: params.grade,
      type: params.type,
      count: params.count,
    });
  }
}
