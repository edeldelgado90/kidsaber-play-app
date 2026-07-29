import { type IEconomyRepository } from '../../ports/IEconomyRepository';
import { type IProgressRepository } from '../../ports/IProgressRepository';
import { getTotalStars } from '../../entities/Progress';
import { seedProfileEconomy } from '../../entities/Economy';

/**
 * Migration for profiles created before the pet update (schema v1 → v2):
 * profiles without economy data get seeded from their historic star total,
 * so stars earned before the update become spendable in the shop.
 */
export async function ensureEconomySeeded(
  economyRepository: IEconomyRepository,
  progressRepository: IProgressRepository,
  profileIds: string[],
): Promise<void> {
  const [economy, progress] = await Promise.all([
    economyRepository.getEconomy(),
    progressRepository.getProgress(),
  ]);

  for (const profileId of profileIds) {
    if (economy.byProfileId[profileId]) continue;

    const profileProgress = progress.byProfileId[profileId];
    const historicStars = profileProgress ? getTotalStars(profileProgress) : 0;
    await economyRepository.saveProfileEconomy(profileId, seedProfileEconomy(historicStars));
  }
}
