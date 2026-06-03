import { create } from 'zustand';
import {
  type Progress,
  createEmptyProfileProgress,
  type ProfileProgress,
} from '../../domain/entities/Progress';
import { type Subject, type GameType } from '../../domain/entities/Question';
import { progressRepository } from '../di/container';

interface ProgressStoreState {
  progress: Progress;
  isLoading: boolean;
}

interface ProgressStoreActions {
  loadProgress: () => Promise<void>;
  addStar: (profileId: string, subject: Subject, gameType: GameType) => Promise<void>;
  getProfileProgress: (profileId: string) => ProfileProgress;
  getStarsForSubject: (profileId: string, subject: Subject) => number;
  getTotalStars: (profileId: string) => number;
}

export type ProgressStore = ProgressStoreState & ProgressStoreActions;

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: { byProfileId: {} },
  isLoading: false,

  loadProgress: async () => {
    set({ isLoading: true });
    try {
      const progress = await progressRepository.getProgress();
      set({ progress, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addStar: async (profileId: string, subject: Subject, gameType: GameType) => {
    await progressRepository.addStar(profileId, subject, gameType);
    const progress = await progressRepository.getProgress();
    set({ progress });
  },

  getProfileProgress: (profileId: string): ProfileProgress => {
    const { progress } = get();
    return progress.byProfileId[profileId] ?? createEmptyProfileProgress();
  },

  getStarsForSubject: (profileId: string, subject: Subject): number => {
    const profileProgress = get().getProfileProgress(profileId);
    return profileProgress.starsBySubject[subject] ?? 0;
  },

  getTotalStars: (profileId: string): number => {
    const profileProgress = get().getProfileProgress(profileId);
    return Object.values(profileProgress.starsBySubject).reduce((sum, n) => sum + (n ?? 0), 0);
  },
}));
