import { type Profile } from '../../entities/Profile';
import { type IProfileRepository } from '../../ports/IProfileRepository';

/**
 * Retrieves all profiles and the active profile ID.
 */
export async function getProfiles(
  repository: IProfileRepository,
): Promise<{ profiles: Profile[]; activeProfileId: string | null }> {
  const [profiles, activeProfileId] = await Promise.all([
    repository.getAll(),
    repository.getActiveProfileId(),
  ]);

  return { profiles, activeProfileId };
}
