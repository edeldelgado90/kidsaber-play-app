import { type IProfileRepository } from '../../ports/IProfileRepository';

/**
 * Deletes a child profile.
 * Restriction: at least one profile must always exist.
 */
export async function deleteProfile(
  repository: IProfileRepository,
  id: string,
): Promise<void> {
  const all = await repository.getAll();

  if (all.length <= 1) {
    throw new Error('Debe existir al menos un perfil. No puedes eliminar el único perfil.');
  }

  const activeId = await repository.getActiveProfileId();
  await repository.delete(id);

  // If the deleted profile was active, switch to another one
  if (activeId === id) {
    const remaining = all.filter(p => p.id !== id);
    if (remaining.length > 0) {
      await repository.setActiveProfileId(remaining[0].id);
    }
  }
}
