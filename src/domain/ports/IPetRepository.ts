import { type Pets, type PetState } from '../entities/Pet';

/**
 * Port for persisting pet state (species, equipment, inventory) per profile.
 */
export interface IPetRepository {
  getPets(): Promise<Pets>;
  getPet(profileId: string): Promise<PetState | null>;
  savePet(profileId: string, pet: PetState): Promise<void>;
  /** Removes the pet of a profile (used when the profile is deleted). */
  resetPet(profileId: string): Promise<void>;
}
