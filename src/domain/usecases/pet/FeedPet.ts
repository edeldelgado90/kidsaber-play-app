import { type IPetRepository } from '../../ports/IPetRepository';
import { type PetState, consumeFood } from '../../entities/Pet';

interface FeedPetInput {
  profileId: string;
  itemId: string;
}

export class NoFoodError extends Error {
  constructor() {
    super('No queda comida de este tipo. ¡Compra más en la tienda!');
    this.name = 'NoFoodError';
  }
}

/**
 * Feeds the pet by consuming one unit of a purchased food item.
 * Feeding always consumes stock (default documented in 08-mascota-tienda.md).
 */
export async function feedPet(
  repository: IPetRepository,
  input: FeedPetInput,
): Promise<PetState> {
  const pet = await repository.getPet(input.profileId);
  if (!pet) throw new Error('Este perfil todavía no tiene mascota.');

  const inventory = consumeFood(pet.inventory, input.itemId);
  if (!inventory) throw new NoFoodError();

  const updated: PetState = { ...pet, inventory };
  await repository.savePet(input.profileId, updated);
  return updated;
}
