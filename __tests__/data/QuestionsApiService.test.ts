/**
 * Tests for the QuestionsApiService data layer.
 * Mocks fetch to avoid real network calls.
 */
import { QuestionsApiService } from '../../src/data/services/QuestionsApiService';
import { type ITokenProvider } from '../../src/domain/ports/ITokenProvider';
import { type IAppCheckProvider } from '../../src/domain/ports/IAppCheckProvider';

const mockQuestion = {
  id: 'q1',
  type: 'option_multiple',
  subject: 'mathematics',
  grade: 3,
  topic: 'multiplication',
  statement: '¿Cuánto es 4 × 6?',
  options: [
    { id: 'A', text: '20' },
    { id: 'B', text: '24' },
    { id: 'C', text: '26' },
    { id: 'D', text: '16' },
  ],
  correctAnswers: ['B'],
  meta: {
    difficulty: 'easy',
    timeLimitMs: 15000,
    tags: ['multiplication'],
  },
};

const makeOkResponse = (body: unknown): Response =>
  ({
    ok: true,
    status: 200,
    json: async () => body,
    clone: function () {
      return this;
    },
  }) as unknown as Response;

const makeErrorResponse = (status: number): Response =>
  ({
    ok: false,
    status,
    json: async () => ({}),
    clone: function () {
      return this;
    },
  }) as unknown as Response;

describe('QuestionsApiService', () => {
  const BASE_URL = 'http://localhost:8080';
  let service: QuestionsApiService;

  beforeEach(() => {
    service = new QuestionsApiService(BASE_URL);
    jest.clearAllMocks();
  });

  it('fetches questions and maps them to domain entities', async () => {
    global.fetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));

    const questions = await service.fetchQuestions({
      subject: 'mathematics',
      grade: 3,
      type: 'option_multiple',
      count: 10,
    });

    expect(questions).toHaveLength(1);
    expect(questions[0].id).toBe('q1');
    expect(questions[0].type).toBe('option_multiple');
    expect(questions[0].correctAnswers).toEqual(['B']);
  });

  it('constructs the correct URL with query params', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));
    global.fetch = mockFetch;

    await service.fetchQuestions({
      subject: 'language',
      grade: 2,
      type: 'fill_in_the_blanks',
      count: 5,
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('subject=language');
    expect(calledUrl).toContain('grade=2');
    expect(calledUrl).toContain('type=fill_in_the_blanks');
    expect(calledUrl).toContain('count=5');
  });

  it('sends Authorization header when tokenProvider returns a token', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));
    global.fetch = mockFetch;

    const tokenProvider: ITokenProvider = { getToken: async () => 'test-jwt-token' };
    const serviceWithToken = new QuestionsApiService(BASE_URL, tokenProvider);

    await serviceWithToken.fetchQuestions({
      subject: 'mathematics',
      grade: 3,
      type: 'option_multiple',
    });

    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect((calledOptions.headers as Record<string, string>)['Authorization']).toBe(
      'Bearer test-jwt-token',
    );
  });

  it('sends no Authorization header when tokenProvider returns null', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));
    global.fetch = mockFetch;

    const tokenProvider: ITokenProvider = { getToken: async () => null };
    const serviceWithNoToken = new QuestionsApiService(BASE_URL, tokenProvider);

    await serviceWithNoToken.fetchQuestions({
      subject: 'mathematics',
      grade: 3,
      type: 'option_multiple',
    });

    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect((calledOptions.headers as Record<string, string>)['Authorization']).toBeUndefined();
  });

  it('sends no Authorization header when no tokenProvider is supplied', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));
    global.fetch = mockFetch;

    await service.fetchQuestions({ subject: 'mathematics', grade: 3, type: 'option_multiple' });

    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect((calledOptions.headers as Record<string, string>)['Authorization']).toBeUndefined();
  });

  it('sends X-Firebase-AppCheck header when appCheckProvider returns a token', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));
    global.fetch = mockFetch;

    const appCheckProvider: IAppCheckProvider = { getAppCheckToken: async () => 'appcheck-token' };
    const serviceWithAppCheck = new QuestionsApiService(BASE_URL, undefined, appCheckProvider);

    await serviceWithAppCheck.fetchQuestions({
      subject: 'mathematics',
      grade: 3,
      type: 'option_multiple',
    });

    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect((calledOptions.headers as Record<string, string>)['X-Firebase-AppCheck']).toBe(
      'appcheck-token',
    );
  });

  it('sends both credentials when both providers return a token', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));
    global.fetch = mockFetch;

    const tokenProvider: ITokenProvider = { getToken: async () => 'id-token' };
    const appCheckProvider: IAppCheckProvider = { getAppCheckToken: async () => 'appcheck-token' };
    const serviceWithBoth = new QuestionsApiService(BASE_URL, tokenProvider, appCheckProvider);

    await serviceWithBoth.fetchQuestions({
      subject: 'mathematics',
      grade: 3,
      type: 'option_multiple',
    });

    const headers = (mockFetch.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer id-token');
    expect(headers['X-Firebase-AppCheck']).toBe('appcheck-token');
  });

  it('sends no X-Firebase-AppCheck header when appCheckProvider returns null', async () => {
    const mockFetch = jest.fn().mockResolvedValue(makeOkResponse({ questions: [mockQuestion] }));
    global.fetch = mockFetch;

    const appCheckProvider: IAppCheckProvider = { getAppCheckToken: async () => null };
    const serviceWithNoAppCheck = new QuestionsApiService(BASE_URL, undefined, appCheckProvider);

    await serviceWithNoAppCheck.fetchQuestions({
      subject: 'mathematics',
      grade: 3,
      type: 'option_multiple',
    });

    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect(
      (calledOptions.headers as Record<string, string>)['X-Firebase-AppCheck'],
    ).toBeUndefined();
  });

  it('throws when response is not ok (500)', async () => {
    global.fetch = jest.fn().mockResolvedValue(makeErrorResponse(500));

    await expect(
      service.fetchQuestions({ subject: 'mathematics', grade: 3, type: 'option_multiple' }),
    ).rejects.toThrow();
  });

  it('throws when response has unexpected format', async () => {
    global.fetch = jest.fn().mockResolvedValue(makeOkResponse({ data: [] })); // missing 'questions' key

    await expect(
      service.fetchQuestions({ subject: 'mathematics', grade: 3, type: 'option_multiple' }),
    ).rejects.toThrow('formato inesperado');
  });

  it('throws NetworkError on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'));

    await expect(
      service.fetchQuestions({ subject: 'mathematics', grade: 3, type: 'option_multiple' }),
    ).rejects.toThrow();
  }, 20000); // extended timeout because of retry backoff

  describe('reportQuestion', () => {
    const makeAcceptedResponse = (): Response =>
      ({
        ok: true,
        status: 202,
        json: async () => ({ status: 'received' }),
        clone: function () {
          return this;
        },
      }) as unknown as Response;

    it('POSTs to the report endpoint for the given question', async () => {
      const mockFetch = jest.fn().mockResolvedValue(makeAcceptedResponse());
      global.fetch = mockFetch;

      await service.reportQuestion('q1');

      const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(`${BASE_URL}/questions/q1/report`);
      expect(init.method).toBe('POST');
    });

    // The API takes only the id and reads the rest from its own database, so
    // nothing a child sees or types can reach the review queue.
    it('sends no request body', async () => {
      const mockFetch = jest.fn().mockResolvedValue(makeAcceptedResponse());
      global.fetch = mockFetch;

      await service.reportQuestion('q1');

      const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(init.body).toBeUndefined();
    });

    it('escapes the question id in the path', async () => {
      const mockFetch = jest.fn().mockResolvedValue(makeAcceptedResponse());
      global.fetch = mockFetch;

      await service.reportQuestion('a/../admin');

      const [url] = mockFetch.mock.calls[0] as [string];
      expect(url).toBe(`${BASE_URL}/questions/a%2F..%2Fadmin/report`);
    });

    it('forwards both credentials when the providers supply them', async () => {
      const mockFetch = jest.fn().mockResolvedValue(makeAcceptedResponse());
      global.fetch = mockFetch;

      const tokenProvider: ITokenProvider = { getToken: jest.fn().mockResolvedValue('id-token') };
      const appCheckProvider: IAppCheckProvider = {
        getAppCheckToken: jest.fn().mockResolvedValue('app-check-token'),
      };

      await new QuestionsApiService(BASE_URL, tokenProvider, appCheckProvider).reportQuestion('q1');

      const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
      const headers = init.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer id-token');
      expect(headers['X-Firebase-AppCheck']).toBe('app-check-token');
    });

    it('rejects when the API refuses the report', async () => {
      global.fetch = jest.fn().mockResolvedValue(makeErrorResponse(404));

      await expect(service.reportQuestion('q1')).rejects.toThrow();
    });
  });
});
