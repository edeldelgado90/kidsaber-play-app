import {
  type IQuestionsService,
  type FetchQuestionsParams,
} from '../../domain/ports/IQuestionsService';
import { type ITokenProvider } from '../../domain/ports/ITokenProvider';
import { type IAppCheckProvider } from '../../domain/ports/IAppCheckProvider';
import { type Question } from '../../domain/entities/Question';
import { fetchQuestionsFromApi, reportQuestionToApi } from '../api/questionsApi';

/**
 * Concrete implementation of IQuestionsService using the KidSaber REST API.
 * The app never calls AI providers directly — only this service via the backend.
 *
 * Authentication is handled transparently by the injected providers: an ID token
 * (who is calling) and an App Check token (that it is a genuine app instance).
 * Either is omitted when its provider is absent or returns null, so tests and
 * auth-disabled backends keep working.
 */
export class QuestionsApiService implements IQuestionsService {
  constructor(
    private readonly baseUrl: string,
    private readonly tokenProvider?: ITokenProvider,
    private readonly appCheckProvider?: IAppCheckProvider,
  ) {}

  async reportQuestion(questionId: string): Promise<void> {
    const [token, appCheckToken] = await this.credentials();

    return reportQuestionToApi(this.baseUrl, questionId, token, appCheckToken);
  }

  async fetchQuestions(params: FetchQuestionsParams): Promise<Question[]> {
    const [token, appCheckToken] = await this.credentials();

    return fetchQuestionsFromApi(
      this.baseUrl,
      {
        subject: params.subject,
        grade: params.grade,
        type: params.type,
        count: params.count,
      },
      token,
      appCheckToken,
    );
  }

  /**
   * Resolves both credentials at once. Each provider serves from cache in the
   * common case, so requesting them in parallel keeps the pre-request cost to a
   * single tick.
   */
  private credentials(): Promise<[string | null | undefined, string | null | undefined]> {
    return Promise.all([
      this.tokenProvider?.getToken(),
      this.appCheckProvider?.getAppCheckToken(),
    ]);
  }
}
