import { type Progress } from '../entities/Progress';
import { type Subject, type GameType } from '../entities/Question';

/**
 * Port (interface) for the progress persistence layer.
 */
export interface IProgressRepository {
  getProgress(): Promise<Progress>;
  addStar(profileId: string, subject: Subject, gameType: GameType): Promise<void>;
  saveLastSession(
    profileId: string,
    subject: Subject,
    gameType: GameType,
    at: string,
  ): Promise<void>;
  resetProgress(profileId: string): Promise<void>;
}
