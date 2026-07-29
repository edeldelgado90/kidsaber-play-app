import { fetchQuestions } from '../../src/domain/usecases/game/FetchQuestions';
import { DEFAULT_QUESTION_COUNT } from '../../src/domain/entities/GameSession';
import type { IQuestionsService } from '../../src/domain/ports/IQuestionsService';
import type { Question } from '../../src/domain/entities/Question';

function makeQuestion(id: string): Question {
  return {
    id,
    type: 'option_multiple',
    subject: 'mathematics',
    grade: 3,
    topic: 'Sumas',
    statement: '2 + 2 = ?',
    options: [{ id: 'a', text: '4' }],
    correctAnswers: ['a'],
    meta: { difficulty: 'easy', timeLimitMs: 30000, tags: [] },
  };
}

function makeService(questions: Question[]): jest.Mocked<IQuestionsService> {
  return {
    fetchQuestions: jest.fn().mockResolvedValue(questions),
    reportQuestion: jest.fn().mockResolvedValue(undefined),
  };
}

describe('fetchQuestions', () => {
  it('returns questions when service returns a non-empty array', async () => {
    const q = [makeQuestion('q1'), makeQuestion('q2')];
    const service = makeService(q);
    const result = await fetchQuestions(service, {
      subject: 'mathematics',
      grade: 3,
      gameType: 'option_multiple',
    });

    expect(result).toEqual(q);
  });

  it('throws when service returns an empty array', async () => {
    const service = makeService([]);
    await expect(
      fetchQuestions(service, { subject: 'mathematics', grade: 3, gameType: 'option_multiple' }),
    ).rejects.toThrow();
  });

  it('throws when service returns something that is not an array', async () => {
    const service = {
      fetchQuestions: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<IQuestionsService>;
    await expect(
      fetchQuestions(service, { subject: 'mathematics', grade: 3, gameType: 'option_multiple' }),
    ).rejects.toThrow();
  });

  it('uses DEFAULT_QUESTION_COUNT when count not specified', async () => {
    const service = makeService([makeQuestion('q1')]);
    await fetchQuestions(service, { subject: 'language', grade: 2, gameType: 'matching' });

    expect(service.fetchQuestions).toHaveBeenCalledWith(
      expect.objectContaining({ count: DEFAULT_QUESTION_COUNT }),
    );
  });

  it('uses provided count when specified', async () => {
    const service = makeService([makeQuestion('q1')]);
    await fetchQuestions(service, {
      subject: 'language',
      grade: 2,
      gameType: 'matching',
      count: 5,
    });

    expect(service.fetchQuestions).toHaveBeenCalledWith(expect.objectContaining({ count: 5 }));
  });
});
