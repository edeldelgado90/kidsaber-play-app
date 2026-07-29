import { type IPetRepository } from '../../ports/IPetRepository';
import { type IEconomyRepository } from '../../ports/IEconomyRepository';
import { type PetState, addFood, ownsCosmetic } from '../../entities/Pet';
import { getShopItem, isCosmeticCategory } from '../../entities/PetCatalog';

interface PurchaseItemInput {
  profileId: string;
  itemId: string;
}

export class InsufficientStarsError extends Error {
  constructor() {
    super('No tienes estrellas suficientes. ¡Juega para ganar más!');
    this.name = 'InsufficientStarsError';
  }
}

export class AlreadyOwnedError extends Error {
  constructor() {
    super('¡Ya tienes este objeto!');
    this.name = 'AlreadyOwnedError';
  }
}

/**
 * Buys a shop item with wallet stars.
 * Only `starWalletBalance` decreases — `lifetimeStarsEarned` (Evolution) never does.
 * Food stacks in the inventory; cosmetics can only be owned once.
 */
export async function purchaseItem(
  petRepository: IPetRepository,
  economyRepository: IEconomyRepository,
  input: PurchaseItemInput,
): Promise<PetState> {
  const item = getShopItem(input.itemId);
  if (!item) throw new Error('Este objeto ya no está disponible.');

  const pet = await petRepository.getPet(input.profileId);
  if (!pet) throw new Error('Este perfil todavía no tiene mascota.');

  if (isCosmeticCategory(item.category) && ownsCosmetic(pet, input.itemId)) {
    throw new AlreadyOwnedError();
  }

  const economy = await economyRepository.getProfileEconomy(input.profileId);
  const balance = economy?.starWalletBalance ?? 0;
  if (balance < item.price) throw new InsufficientStarsError();

  await economyRepository.saveProfileEconomy(input.profileId, {
    lifetimeStarsEarned: economy?.lifetimeStarsEarned ?? 0,
    starWalletBalance: balance - item.price,
  });

  const updated: PetState =
    item.category === 'food'
      ? { ...pet, inventory: addFood(pet.inventory, item.id, 1) }
      : { ...pet, inventory: { ...pet.inventory, cosmetics: [...pet.inventory.cosmetics, item.id] } };

  await petRepository.savePet(input.profileId, updated);
  return updated;
}
