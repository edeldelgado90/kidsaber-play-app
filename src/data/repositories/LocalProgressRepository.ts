import { type Progress } from '../../domain/entities/Progress';
import { type IProgressRepository } from '../../domain/ports/IProgressRepository';
import { type Subject, type GameType } from '../../domain/entities/Question';
import { AsyncStorageAdapter } from '../storage/AsyncStorageAdapter';
import { StorageKeys } from '../storage/StorageKeys';

function isProgress(val: unknown): val is Progress {
  return (
    typeof val === 'object' &&
    val !== null &&
    typeof (val as Progress).byProfileId === 'object' &&
    (val as Progress).byProfileId !== null
  );
}

/**
 * AsyncStorage-backed repository for child progress data (stars per subject/game type).
 */
export class LocalProgressRepository implements IProgressRepository {
  private async loadProgress(): Promise<Progress> {
    const stored = await AsyncStorageAdapter.get(StorageKeys.PROGRESS, isProgress);
    return stored ?? { byProfileId: {} };
  }

  private async saveProgress(progress: Progress): Promise<void> {
    await AsyncStorageAdapter.set(StorageKeys.PROGRESS, progress);
  }

  async getProgress(): Promise<Progress> {
    return this.loadProgress();
  }

  async addStar(profileId: string, subject: Subject, gameType: GameType): Promise<void> {
    const progress = await this.loadProgress();

    if (!progress.byProfileId[profileId]) {
      progress.byProfileId[profileId] = {
        starsBySubject: {},
        starsByGameType: {},
        lastSession: null,
      };
    }

    const profile = progress.byProfileId[profileId];
    profile.starsBySubject[subject] = (profile.starsBySubject[subject] ?? 0) + 1;
    profile.starsByGameType[gameType] = (profile.starsByGameType[gameType] ?? 0) + 1;

    await this.saveProgress(progress);
  }

  async saveLastSession(
    profileId: string,
    subject: Subject,
    gameType: GameType,
    at: string,
  ): Promise<void> {
    const progress = await this.loadProgress();

    if (!progress.byProfileId[profileId]) {
      progress.byProfileId[profileId] = {
        starsBySubject: {},
        starsByGameType: {},
        lastSession: null,
      };
    }

    progress.byProfileId[profileId].lastSession = { subject, gameType, at };
    await this.saveProgress(progress);
  }

  async resetProgress(profileId: string): Promise<void> {
    const progress = await this.loadProgress();
    delete progress.byProfileId[profileId];
    await this.saveProgress(progress);
  }
}
