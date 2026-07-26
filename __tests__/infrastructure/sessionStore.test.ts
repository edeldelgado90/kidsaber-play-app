import type { Question } from '../../src/domain/entities/Question';

// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('../../src/infrastructure/di/container', () => ({
  profileRepository: {},
  progressRepository: {
    getProgress: jest.fn(),
    addStar: jest.fn(),
    saveLastSession: jest.fn(),
    resetProgress: jest.fn(),
  },
  questionsService: { fetchQuestions: jest.fn() },
}));

import { progressRepository, questionsService } from '../../src/infrastructure/di/container';
import { useSessionStore } from '../../src/infrastructure/store/sessionStore';

const mockProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;
const mockQuestionsService = questionsService as jest.Mocked<typeof questionsService>;

function makeQuestion(id: string, correctOptionId = 'opt-a'): Question {
  return {
    id,
    type: 'option_multiple',
    subject: 'mathematics',
    grade: 3,
    topic: 'Sumas',
    statement: '2 + 2 = ?',
    options: [
      { id: 'opt-a', text: '4' },
      { id: 'opt-b', text: '3' },
    ],
    correctAnswers: [correctOptionId],
    meta: { difficulty: 'easy', timeLimitMs: 30000, tags: [] },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockProgressRepo.saveLastSession.mockResolvedValue(undefined);
  mockProgressRepo.addStar.mockResolvedValue(undefined);
  useSessionStore.getState().resetSession();
});

describe('sessionStore', () => {
  it('startSession — success: sets questions and status to playing', async () => {
    const questions = [makeQuestion('q1'), makeQuestion('q2')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);

    expect(useSessionStore.getState().status).toBe('playing');
    expect(useSessionStore.getState().questions).toHaveLength(2);
    expect(useSessionStore.getState().currentIndex).toBe(0);
  });

  it('startSession — error: sets status to error', async () => {
    mockQuestionsService.fetchQuestions.mockResolvedValue([]);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);

    expect(useSessionStore.getState().status).toBe('error');
    expect(useSessionStore.getState().error).toBeTruthy();
  });

  it('startSession — fetch throws: sets error', async () => {
    mockQuestionsService.fetchQuestions.mockRejectedValue(new Error('network'));

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);

    expect(useSessionStore.getState().status).toBe('error');
  });

  it('submitAnswer — correct answer returns true and records answer', async () => {
    const questions = [makeQuestion('q1', 'opt-a')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);

    const result = useSessionStore.getState().submitAnswer('opt-a');
    expect(result).toBe(true);
    expect(useSessionStore.getState().answers[0].isCorrect).toBe(true);
  });

  it('submitAnswer — wrong answer returns false', async () => {
    const questions = [makeQuestion('q1', 'opt-a')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);

    const result = useSessionStore.getState().submitAnswer('opt-b');
    expect(result).toBe(false);
    expect(useSessionStore.getState().answers[0].isCorrect).toBe(false);
  });

  it('submitAnswer — returns false when no current question', async () => {
    expect(useSessionStore.getState().submitAnswer('anything')).toBe(false);
  });

  it('advanceQuestion — mid session increments currentIndex', async () => {
    const questions = [makeQuestion('q1'), makeQuestion('q2'), makeQuestion('q3')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);
    useSessionStore.getState().submitAnswer('opt-a');
    useSessionStore.getState().advanceQuestion();

    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().status).toBe('playing');
  });

  it('advanceQuestion — last question with ≥80% correct sets starEarned true', async () => {
    const questions = [makeQuestion('q1', 'opt-a')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);
    useSessionStore.getState().submitAnswer('opt-a');
    useSessionStore.getState().advanceQuestion();

    expect(useSessionStore.getState().status).toBe('finished');
    expect(useSessionStore.getState().starEarned).toBe(true);
  });

  it('advanceQuestion — last question with <80% correct sets starEarned false', async () => {
    const questions = [makeQuestion('q1', 'opt-a')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);
    useSessionStore.getState().submitAnswer('opt-b');
    useSessionStore.getState().advanceQuestion();

    expect(useSessionStore.getState().status).toBe('finished');
    expect(useSessionStore.getState().starEarned).toBe(false);
  });

  it('finishSession saves result to repo when subject and gameType are set', async () => {
    const questions = [makeQuestion('q1')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);
    useSessionStore.getState().submitAnswer('opt-a');
    useSessionStore.getState().advanceQuestion();
    await useSessionStore.getState().finishSession('p1');

    expect(mockProgressRepo.saveLastSession).toHaveBeenCalledWith(
      'p1',
      'mathematics',
      'option_multiple',
      expect.any(String),
    );
  });

  it('finishSession does nothing when subject is null', async () => {
    await useSessionStore.getState().finishSession('p1');

    expect(mockProgressRepo.saveLastSession).not.toHaveBeenCalled();
  });

  it('resetSession restores initial state', async () => {
    const questions = [makeQuestion('q1')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);
    useSessionStore.getState().resetSession();

    expect(useSessionStore.getState().status).toBe('idle');
    expect(useSessionStore.getState().questions).toHaveLength(0);
    expect(useSessionStore.getState().currentIndex).toBe(0);
  });

  it('getCurrentQuestion returns current question', async () => {
    const questions = [makeQuestion('q1'), makeQuestion('q2')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);

    expect(useSessionStore.getState().getCurrentQuestion()?.id).toBe('q1');
  });

  it('getCurrentQuestion returns null when no questions', async () => {
    expect(useSessionStore.getState().getCurrentQuestion()).toBeNull();
  });

  it('getScore returns correctCount and totalCount', async () => {
    const questions = [makeQuestion('q1'), makeQuestion('q2')];
    mockQuestionsService.fetchQuestions.mockResolvedValue(questions);

    await useSessionStore.getState().startSession('p1', 'mathematics', 'option_multiple', 3);
    useSessionStore.getState().submitAnswer('opt-a'); // correct
    useSessionStore.getState().advanceQuestion();
    useSessionStore.getState().submitAnswer('opt-b'); // wrong

    const { correctCount, totalCount } = useSessionStore.getState().getScore();
    expect(correctCount).toBe(1);
    expect(totalCount).toBe(2);
  });
});
