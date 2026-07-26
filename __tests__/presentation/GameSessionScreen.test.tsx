import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { Profile } from '../../src/domain/entities/Profile';
import type { Question } from '../../src/domain/entities/Question';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'MaterialCommunityIcons' }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: RN.View,
    Svg: RN.View,
    Circle: RN.View,
    Line: RN.View,
    Rect: RN.View,
    Defs: RN.View,
    RadialGradient: RN.View,
    Stop: RN.View,
  };
});

// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ subject: 'mathematics', gameType: 'option_multiple' })),
}));

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

const activeProfile: Profile = { id: 'p1', name: 'Ana', grade: 3, createdAt: '' };
const mockQuestion: Question = {
  id: 'q1',
  statement: '¿Cuánto es 2+2?',
  correctAnswers: ['opt-b'],
  options: [
    { id: 'opt-a', text: '3' },
    { id: 'opt-b', text: '4' },
    { id: 'opt-c', text: '5' },
    { id: 'opt-d', text: '6' },
  ],
  subject: 'mathematics',
  grade: 3,
  topic: 'Sumas',
  type: 'option_multiple',
  meta: { difficulty: 'easy', timeLimitMs: 30000, tags: [] },
};

const mockStartSession = jest.fn().mockResolvedValue(undefined);
const mockSubmitAnswer = jest.fn().mockReturnValue(true);
const mockAdvanceQuestion = jest.fn();
const mockFinishSession = jest.fn().mockResolvedValue(undefined);
const mockResetSession = jest.fn();
const mockLoadProgress = jest.fn().mockResolvedValue(undefined);

jest.mock('../../src/infrastructure/store/sessionStore', () => ({
  useSessionStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      status: 'playing' as const,
      questions: [mockQuestion],
      currentIndex: 0,
      answers: [],
      starEarned: false,
      error: null,
      startSession: mockStartSession,
      submitAnswer: mockSubmitAnswer,
      advanceQuestion: mockAdvanceQuestion,
      finishSession: mockFinishSession,
      resetSession: mockResetSession,
      getCurrentQuestion: () => mockQuestion,
      getScore: () => ({ correct: 0, total: 1 }),
    };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('../../src/infrastructure/store/progressStore', () => ({
  useProgressStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = { loadProgress: mockLoadProgress };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('../../src/infrastructure/store/profileStore', () => ({
  useProfileStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      activeProfileId: 'p1',
      getActiveProfile: () => activeProfile,
    };
    return selector ? selector(state) : state;
  }),
}));

import { GameSessionScreen } from '../../src/presentation/screens/GameSessionScreen';

beforeEach(() => jest.clearAllMocks());

describe('GameSessionScreen', () => {
  it('renders question statement', () => {
    const { getByText } = render(<GameSessionScreen />);
    expect(getByText('¿Cuánto es 2+2?')).toBeTruthy();
  });

  it('renders 4 option cards', () => {
    const { getByText } = render(<GameSessionScreen />);
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('6')).toBeTruthy();
  });

  it('renders Comprobar button', () => {
    const { getByLabelText } = render(<GameSessionScreen />);
    expect(getByLabelText('Comprobar respuesta')).toBeTruthy();
  });

  it('calls router.back and resetSession when back pressed', () => {
    const { getByLabelText } = render(<GameSessionScreen />);
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(mockRouter.back).toHaveBeenCalled();
    expect(mockResetSession).toHaveBeenCalled();
  });

  it('renders header with subject and game type', () => {
    const { getByText } = render(<GameSessionScreen />);
    expect(getByText(/Matemáticas/)).toBeTruthy();
    expect(getByText(/Opción múltiple/)).toBeTruthy();
  });

  it('renders progress bar', () => {
    const { getByText } = render(<GameSessionScreen />);
    expect(getByText('Pregunta 1/1')).toBeTruthy();
  });
});

describe('GameSessionScreen loading state', () => {
  it('renders skeleton loader when loading', () => {
    const { useSessionStore } = require('../../src/infrastructure/store/sessionStore');
    useSessionStore.mockImplementation((selector?: (s: unknown) => unknown) => {
      const state = {
        status: 'loading' as const,
        questions: [],
        currentIndex: 0,
        answers: [],
        starEarned: false,
        error: null,
        startSession: mockStartSession,
        submitAnswer: mockSubmitAnswer,
        advanceQuestion: mockAdvanceQuestion,
        finishSession: mockFinishSession,
        resetSession: mockResetSession,
        getCurrentQuestion: () => null,
        getScore: () => ({ correct: 0, total: 0 }),
      };
      return selector ? selector(state) : state;
    });

    const { toJSON } = render(<GameSessionScreen />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('GameSessionScreen error state', () => {
  it('renders error retry when status is error', () => {
    const { useSessionStore } = require('../../src/infrastructure/store/sessionStore');
    useSessionStore.mockImplementation((selector?: (s: unknown) => unknown) => {
      const state = {
        status: 'error' as const,
        questions: [],
        currentIndex: 0,
        answers: [],
        starEarned: false,
        error: 'Error de red',
        startSession: mockStartSession,
        submitAnswer: mockSubmitAnswer,
        advanceQuestion: mockAdvanceQuestion,
        finishSession: mockFinishSession,
        resetSession: mockResetSession,
        getCurrentQuestion: () => null,
        getScore: () => ({ correct: 0, total: 0 }),
      };
      return selector ? selector(state) : state;
    });

    const { getByText } = render(<GameSessionScreen />);
    expect(getByText('Error de red')).toBeTruthy();
  });
});

describe('GameSessionScreen idle/null state', () => {
  it('returns null when idle and no current question', () => {
    const { useSessionStore } = require('../../src/infrastructure/store/sessionStore');
    useSessionStore.mockImplementation((selector?: (s: unknown) => unknown) => {
      const state = {
        status: 'idle' as const,
        questions: [],
        currentIndex: 0,
        answers: [],
        starEarned: false,
        error: null,
        startSession: mockStartSession,
        submitAnswer: mockSubmitAnswer,
        advanceQuestion: mockAdvanceQuestion,
        finishSession: mockFinishSession,
        resetSession: mockResetSession,
        getCurrentQuestion: () => null,
        getScore: () => ({ correct: 0, total: 0 }),
      };
      return selector ? selector(state) : state;
    });

    const { toJSON } = render(<GameSessionScreen />);
    expect(toJSON()).toBeNull();
  });
});
