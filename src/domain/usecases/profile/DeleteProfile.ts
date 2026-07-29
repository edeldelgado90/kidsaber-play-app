import { type IProfileRepository } from '../../ports/IProfileRepository';
import { type IProgressRepository } from '../../ports/IProgressRepository';
import { type IPetRepository } from '../../ports/IPetRepository';
import { type IEconomyRepository } from '../../ports/IEconomyRepository';

/**
 * Deletes a child profile and all associated data (progress, pet, economy).
 * Restriction: at least one profile must always exist.
 */
export async function deleteProfile(
  repository: IProfileRepository,
  progressRepository: IProgressRepository,
  petRepository: IPetRepository,
  economyRepository: IEconomyRepository,
  id: string,
): Promise<void> {
  const all = await repository.getAll();

  if (all.length <= 1) {
    throw new Error('Debe existir al menos un perfil. No puedes eliminar el único perfil.');
  }

  const activeId = await repository.getActiveProfileId();
  await repository.delete(id);
  await progressRepository.resetProgress(id);
  await petRepository.resetPet(id);
  await economyRepository.resetEconomy(id);

  // If the deleted profile was active, switch to another one
  if (activeId === id) {
    const remaining = all.filter(p => p.id !== id);
    if (remaining.length > 0) {
      await repository.setActiveProfileId(remaining[0].id);
    }
  }
}
