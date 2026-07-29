import { create } from 'zustand';
import { type Question, type Subject, type GameType } from '../../domain/entities/Question';
import {
  type GameSessionAnswer,
  calculateStarEarned,
  countCorrectAnswers,
} from '../../domain/entities/GameSession';
import { validateAnswer } from '../../domain/usecases/game/ValidateAnswer';
import { fetchQuestions } from '../../domain/usecases/game/FetchQuestions';
import { saveSessionResult } from '../../domain/usecases/game/SaveSessionResult';
import { questionsService, progressRepository, economyRepository } from '../di/container';
import { useEconomyStore } from './economyStore';

export type SessionStatus = 'idle' | 'loading' | 'playing' | 'finished' | 'error';

interface SessionStoreState {
  subject: Subject | null;
  gameType: GameType | null;
  grade: number | null;
  questions: Question[];
  currentIndex: number;
  answers: GameSessionAnswer[];
  status: SessionStatus;
  error: string | null;
  starEarned: boolean;
}

interface SessionStoreActions {
  startSession: (
    profileId: string,
    subject: Subject,
    gameType: GameType,
    grade: number,
  ) => Promise<void>;
  submitAnswer: (userAnswer: unknown) => boolean;
  advanceQuestion: () => void;
  finishSession: (profileId: string) => Promise<void>;
  resetSession: () => void;
  getCurrentQuestion: () => Question | null;
  getScore: () => { correctCount: number; totalCount: number };
}

export type SessionStore = SessionStoreState & SessionStoreActions;

const initialState: SessionStoreState = {
  subject: null,
  gameType: null,
  grade: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  status: 'idle',
  error: null,
  starEarned: false,
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  startSession: async (_profileId: string, subject: Subject, gameType: GameType, grade: number) => {
    set({ ...initialState, status: 'loading', subject, gameType, grade });

    try {
      const questions = await fetchQuestions(questionsService, {
        subject,
        gameType,
        grade,
      });
      set({ questions, status: 'playing', currentIndex: 0, answers: [] });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar las preguntas.';
      set({ status: 'error', error: message });
    }
  },

  submitAnswer: (userAnswer: unknown): boolean => {
    const { questions, currentIndex, answers } = get();
    const question = questions[currentIndex];
    if (!question) return false;

    const isCorrect = validateAnswer(question, userAnswer);
    set({ answers: [...answers, { questionId: question.id, isCorrect }] });
    return isCorrect;
  },

  advanceQuestion: () => {
    const { questions, currentIndex, answers } = get();
    const isLastQuestion = currentIndex >= questions.length - 1;

    if (isLastQuestion) {
      const correctCount = countCorrectAnswers(answers);
      const starEarned = calculateStarEarned(correctCount, answers.length);
      set({ status: 'finished', starEarned });
    } else {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  finishSession: async (profileId: string) => {
    const { subject, gameType, starEarned } = get();
    if (!subject || !gameType) return;

    await saveSessionResult(progressRepository, economyRepository, {
      profileId,
      subject,
      gameType,
      starEarned,
    });

    // Wallet balance may have changed — keep the economy store in sync
    await useEconomyStore.getState().loadEconomy();
  },

  resetSession: () => set(initialState),

  getCurrentQuestion: (): Question | null => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] ?? null;
  },

  getScore: () => {
    const { answers } = get();
    return {
      correctCount: countCorrectAnswers(answers),
      totalCount: answers.length,
    };
  },
}));
