import { type IPetRepository } from '../../ports/IPetRepository';
import { type PetSpeciesId, type PetState, createPetState } from '../../entities/Pet';
import { getSpecies } from '../../entities/PetCatalog';

interface ChoosePetSpeciesInput {
  profileId: string;
  speciesId: PetSpeciesId;
}

/**
 * Assigns a pet species to a profile.
 * First choice creates the pet; choosing again keeps inventory and equipment
 * (cosmetics are species-independent paper-doll layers).
 */
export async function choosePetSpecies(
  repository: IPetRepository,
  input: ChoosePetSpeciesInput,
): Promise<PetState> {
  getSpecies(input.speciesId); // throws on unknown species

  const existing = await repository.getPet(input.profileId);
  const pet: PetState = existing
    ? { ...existing, speciesId: input.speciesId }
    : createPetState(input.speciesId);

  await repository.savePet(input.profileId, pet);
  return pet;
}
