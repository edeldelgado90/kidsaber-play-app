import { type Subject, type GameType } from './Question';

/**
 * Local progress data persisted per child profile.
 * In v1, stars are earned at the rate of 1 per session when accuracy > 80%.
 */
export interface ProfileProgress {
  starsBySubject: Partial<Record<Subject, number>>;
  starsByGameType: Partial<Record<GameType, number>>;
  lastSession: {
    subject: Subject;
    gameType: GameType;
    at: string; // ISO 8601
  } | null;
}

export interface Progress {
  byProfileId: Record<string, ProfileProgress>;
}

export function createEmptyProfileProgress(): ProfileProgress {
  return {
    starsBySubject: {},
    starsByGameType: {},
    lastSession: null,
  };
}

export function getStarsForSubject(progress: ProfileProgress, subject: Subject): number {
  return progress.starsBySubject[subject] ?? 0;
}

export function getStarsForGameType(progress: ProfileProgress, gameType: GameType): number {
  return progress.starsByGameType[gameType] ?? 0;
}

export function getTotalStars(progress: ProfileProgress): number {
  return Object.values(progress.starsBySubject).reduce((sum, n) => sum + (n ?? 0), 0);
}
