import {
  type Progress,
  type ProfileProgress,
  createEmptyProfileProgress,
} from '../../entities/Progress';
import { type IProgressRepository } from '../../ports/IProgressRepository';

/**
 * Returns the full progress object, providing an empty profile progress
 * if the profile hasn't played any games yet.
 */
export async function getProgress(
  repository: IProgressRepository,
  profileId: string,
): Promise<ProfileProgress> {
  const progress: Progress = await repository.getProgress();
  return progress.byProfileId[profileId] ?? createEmptyProfileProgress();
}
