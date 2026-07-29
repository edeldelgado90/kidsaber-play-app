import { feedPet, NoFoodError } from '../../src/domain/usecases/pet/FeedPet';
import { createPetState, addFood } from '../../src/domain/entities/Pet';
import { makeInMemoryPetRepo } from '../../test-utils/petFakes';

describe('feedPet', () => {
  it('consumes one unit of the food item', async () => {
    const pet = createPetState('capybara');
    pet.inventory = addFood(pet.inventory, 'food_apple', 2);
    const repo = makeInMemoryPetRepo({ p1: pet });

    const updated = await feedPet(repo, { profileId: 'p1', itemId: 'food_apple' });

    expect(updated.inventory.food).toEqual([{ itemId: 'food_apple', qty: 1 }]);
  });

  it('throws NoFoodError when there is no stock', async () => {
    const repo = makeInMemoryPetRepo({ p1: createPetState('capybara') });

    await expect(feedPet(repo, { profileId: 'p1', itemId: 'food_apple' })).rejects.toBeInstanceOf(
      NoFoodError,
    );
  });

  it('throws when the profile has no pet', async () => {
    const repo = makeInMemoryPetRepo();
    await expect(feedPet(repo, { profileId: 'p1', itemId: 'food_apple' })).rejects.toThrow(
      'mascota',
    );
  });
});
