import { equipItem } from '../../src/domain/usecases/pet/EquipItem';
import { createPetState } from '../../src/domain/entities/Pet';
import { makeInMemoryPetRepo } from '../../test-utils/petFakes';

describe('equipItem', () => {
  it('equips an owned cosmetic in its slot', async () => {
    const pet = createPetState('shiba');
    pet.inventory.cosmetics.push('hat_wool');
    const repo = makeInMemoryPetRepo({ p1: pet });

    const updated = await equipItem(repo, { profileId: 'p1', slot: 'hat', itemId: 'hat_wool' });

    expect(updated.equipped.hat).toBe('hat_wool');
  });

  it('unequips a slot with itemId null', async () => {
    const pet = createPetState('shiba');
    pet.inventory.cosmetics.push('hat_wool');
    pet.equipped.hat = 'hat_wool';
    const repo = makeInMemoryPetRepo({ p1: pet });

    const updated = await equipItem(repo, { profileId: 'p1', slot: 'hat', itemId: null });

    expect(updated.equipped.hat).toBeNull();
  });

  it('rejects items not owned', async () => {
    const repo = makeInMemoryPetRepo({ p1: createPetState('shiba') });

    await expect(
      equipItem(repo, { profileId: 'p1', slot: 'hat', itemId: 'hat_wool' }),
    ).rejects.toThrow('tienda');
  });

  it('rejects an item equipped in the wrong slot', async () => {
    const pet = createPetState('shiba');
    pet.inventory.cosmetics.push('hat_wool');
    const repo = makeInMemoryPetRepo({ p1: pet });

    await expect(
      equipItem(repo, { profileId: 'p1', slot: 'glasses', itemId: 'hat_wool' }),
    ).rejects.toThrow('ranura');
  });
});
