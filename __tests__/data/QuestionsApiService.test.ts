/**
 * Tests for the QuestionsApiService data layer.
 * Mocks fetch to avoid real network calls.
 */
import { QuestionsApiService } from '../../src/data/services/QuestionsApiService';

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

describe('QuestionsApiService', () => {
  const BASE_URL = 'http://localhost:8080';
  let service: QuestionsApiService;

  beforeEach(() => {
    service = new QuestionsApiService(BASE_URL);
    jest.clearAllMocks();
  });

  it('fetches questions and maps them to domain entities', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ questions: [mockQuestion] }),
    } as unknown as Response);

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
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ questions: [mockQuestion] }),
    } as unknown as Response);
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

  it('throws when response is not ok (500)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as unknown as Response);

    await expect(
      service.fetchQuestions({ subject: 'mathematics', grade: 3, type: 'option_multiple' }),
    ).rejects.toThrow();
  });

  it('throws when response has unexpected format', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }), // missing 'questions' key
    } as unknown as Response);

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
});
