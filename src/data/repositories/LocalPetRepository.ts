import { type Pets, type PetState, EQUIP_SLOTS } from '../../domain/entities/Pet';
import { type IPetRepository } from '../../domain/ports/IPetRepository';
import { AsyncStorageAdapter } from '../storage/AsyncStorageAdapter';
import { StorageKeys } from '../storage/StorageKeys';

function isPetState(val: unknown): val is PetState {
  if (typeof val !== 'object' || val === null) return false;
  const pet = val as PetState;
  return (
    typeof pet.speciesId === 'string' &&
    typeof pet.equipped === 'object' &&
    pet.equipped !== null &&
    typeof pet.inventory === 'object' &&
    pet.inventory !== null &&
    Array.isArray(pet.inventory.food) &&
    Array.isArray(pet.inventory.cosmetics)
  );
}

function isPets(val: unknown): val is Pets {
  if (typeof val !== 'object' || val === null) return false;
  const pets = val as Pets;
  if (typeof pets.byProfileId !== 'object' || pets.byProfileId === null) return false;
  return Object.values(pets.byProfileId).every(isPetState);
}

/** Fills missing equip slots so older stored pets survive catalog growth. */
function normalizePet(pet: PetState): PetState {
  const equipped = { ...pet.equipped };
  for (const slot of EQUIP_SLOTS) {
    if (!(slot in equipped)) equipped[slot] = null;
  }
  // Early v1.5 builds stored 'kitten'; the species became the shiba dog
  const speciesId = (pet.speciesId as string) === 'kitten' ? 'shiba' : pet.speciesId;
  return { ...pet, speciesId, equipped };
}

/**
 * AsyncStorage-backed repository for pet state (one pet per child profile).
 */
export class LocalPetRepository implements IPetRepository {
  private async loadPets(): Promise<Pets> {
    const stored = await AsyncStorageAdapter.get(StorageKeys.PETS, isPets);
    return stored ?? { byProfileId: {} };
  }

  async getPets(): Promise<Pets> {
    return this.loadPets();
  }

  async getPet(profileId: string): Promise<PetState | null> {
    const pets = await this.loadPets();
    const pet = pets.byProfileId[profileId];
    return pet ? normalizePet(pet) : null;
  }

  async savePet(profileId: string, pet: PetState): Promise<void> {
    const pets = await this.loadPets();
    pets.byProfileId[profileId] = normalizePet(pet);
    await AsyncStorageAdapter.set(StorageKeys.PETS, pets);
  }

  async resetPet(profileId: string): Promise<void> {
    const pets = await this.loadPets();
    delete pets.byProfileId[profileId];
    await AsyncStorageAdapter.set(StorageKeys.PETS, pets);
  }
}
