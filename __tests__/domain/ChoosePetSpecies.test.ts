import { choosePetSpecies } from '../../src/domain/usecases/pet/ChoosePetSpecies';
import { createPetState, addFood, type PetSpeciesId } from '../../src/domain/entities/Pet';
import { makeInMemoryPetRepo } from '../../test-utils/petFakes';

describe('choosePetSpecies', () => {
  it('creates a fresh pet on first choice', async () => {
    const repo = makeInMemoryPetRepo();

    const pet = await choosePetSpecies(repo, { profileId: 'p1', speciesId: 'capybara' });

    expect(pet.speciesId).toBe('capybara');
    expect(await repo.getPet('p1')).toEqual(pet);
  });

  it('keeps inventory and equipment when changing species', async () => {
    const existing = createPetState('capybara');
    existing.inventory = addFood(existing.inventory, 'food_apple', 3);
    existing.inventory.cosmetics.push('hat_wool');
    existing.equipped.hat = 'hat_wool';
    const repo = makeInMemoryPetRepo({ p1: existing });

    const pet = await choosePetSpecies(repo, { profileId: 'p1', speciesId: 'dragon' });

    expect(pet.speciesId).toBe('dragon');
    expect(pet.inventory.food).toEqual([{ itemId: 'food_apple', qty: 3 }]);
    expect(pet.equipped.hat).toBe('hat_wool');
  });

  it('rejects unknown species', async () => {
    const repo = makeInMemoryPetRepo();
    await expect(
      choosePetSpecies(repo, { profileId: 'p1', speciesId: 'unicorn' as PetSpeciesId }),
    ).rejects.toThrow('Especie desconocida');
  });
});
