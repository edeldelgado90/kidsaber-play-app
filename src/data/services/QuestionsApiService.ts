import { type IQuestionsService, type FetchQuestionsParams } from '../../domain/ports/IQuestionsService';
import { type ITokenProvider } from '../../domain/ports/ITokenProvider';
import { type Question } from '../../domain/entities/Question';
import { fetchQuestionsFromApi } from '../api/questionsApi';

/**
 * Concrete implementation of IQuestionsService using the KidSaber REST API.
 * The app never calls AI providers directly — only this service via the backend.
 *
 * Authentication is handled transparently by the injected ITokenProvider.
 * If no provider is supplied (e.g. tests or auth-disabled backends), requests
 * are made without a bearer header.
 */
export class QuestionsApiService implements IQuestionsService {
  constructor(
    private readonly baseUrl: string,
    private readonly tokenProvider?: ITokenProvider,
  ) {}

  async fetchQuestions(params: FetchQuestionsParams): Promise<Question[]> {
    // Resolve the token before building the request. DeviceTokenService
    // handles caching and proactive refresh internally.
    const token = await this.tokenProvider?.getToken();

    return fetchQuestionsFromApi(
      this.baseUrl,
      {
        subject: params.subject,
        grade: params.grade,
        type: params.type,
        count: params.count,
      },
      token,
    );
  }
}
