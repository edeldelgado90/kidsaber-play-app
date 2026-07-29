import { type IPetRepository } from '../../ports/IPetRepository';
import { type EquipSlot, type PetState, ownsCosmetic } from '../../entities/Pet';
import { getShopItem, isCosmeticCategory } from '../../entities/PetCatalog';

interface EquipItemInput {
  profileId: string;
  slot: EquipSlot;
  /** Item id to equip, or null to unequip the slot. */
  itemId: string | null;
}

/**
 * Equips an owned cosmetic in its paper-doll slot (one item per slot),
 * or clears the slot when itemId is null.
 */
export async function equipItem(
  repository: IPetRepository,
  input: EquipItemInput,
): Promise<PetState> {
  const pet = await repository.getPet(input.profileId);
  if (!pet) throw new Error('Este perfil todavía no tiene mascota.');

  if (input.itemId !== null) {
    const item = getShopItem(input.itemId);
    if (!item || !isCosmeticCategory(item.category) || item.category !== input.slot) {
      throw new Error('Este objeto no se puede equipar en esa ranura.');
    }
    if (!ownsCosmetic(pet, input.itemId)) {
      throw new Error('Todavía no tienes este objeto. ¡Cómpralo en la tienda!');
    }
  }

  const updated: PetState = {
    ...pet,
    equipped: { ...pet.equipped, [input.slot]: input.itemId },
  };
  await repository.savePet(input.profileId, updated);
  return updated;
}
