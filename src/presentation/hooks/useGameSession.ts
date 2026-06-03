import { useSessionStore } from '@/infrastructure/store/sessionStore';
import { useProgressStore } from '@/infrastructure/store/progressStore';
import { type Subject, type GameType } from '@/domain/entities/Question';

/**
 * Hook for the game session lifecycle.
 * Connects session store + progress store.
 */
export function useGameSession() {
  const session = useSessionStore();
  const progress = useProgressStore();

  const startSession = async (
    profileId: string,
    subject: Subject,
    gameType: GameType,
    grade: number,
  ) => {
    await session.startSession(profileId, subject, gameType, grade);
  };

  const submitAnswer = (userAnswer: unknown): boolean => {
    return session.submitAnswer(userAnswer);
  };

  const advanceQuestion = () => {
    session.advanceQuestion();
  };

  const finishAndSave = async (profileId: string) => {
    await session.finishSession(profileId);
    // Reload progress so UI reflects the new star immediately
    await progress.loadProgress();
  };

  return {
    status: session.status,
    questions: session.questions,
    currentIndex: session.currentIndex,
    currentQuestion: session.getCurrentQuestion(),
    answers: session.answers,
    starEarned: session.starEarned,
    error: session.error,
    score: session.getScore(),
    startSession,
    submitAnswer,
    advanceQuestion,
    finishAndSave,
    resetSession: session.resetSession,
  };
}
