import {
  createPetState,
  addFood,
  consumeFood,
  getTotalFoodCount,
  getFoodQty,
  ownsCosmetic,
} from '../../src/domain/entities/Pet';

describe('createPetState', () => {
  it('creates an empty pet with all slots unequipped', () => {
    const pet = createPetState('capybara');
    expect(pet.speciesId).toBe('capybara');
    expect(pet.equipped).toEqual({ hat: null, coat: null, shoes: null, glasses: null });
    expect(pet.inventory).toEqual({ food: [], cosmetics: [] });
  });
});

describe('food inventory', () => {
  it('addFood stacks quantities of the same item', () => {
    let inv = createPetState('kitten').inventory;
    inv = addFood(inv, 'food_apple', 1);
    inv = addFood(inv, 'food_apple', 2);
    expect(inv.food).toEqual([{ itemId: 'food_apple', qty: 3 }]);
  });

  it('consumeFood decrements and removes empty stacks', () => {
    const inv = addFood(createPetState('kitten').inventory, 'food_apple', 1);
    const consumed = consumeFood(inv, 'food_apple');
    expect(consumed).not.toBeNull();
    expect(consumed?.food).toEqual([]);
  });

  it('consumeFood returns null when out of stock', () => {
    const inv = createPetState('kitten').inventory;
    expect(consumeFood(inv, 'food_apple')).toBeNull();
  });

  it('getTotalFoodCount and getFoodQty sum stacks', () => {
    const pet = createPetState('dragon');
    pet.inventory = addFood(addFood(pet.inventory, 'food_apple', 2), 'food_cookie', 1);
    expect(getTotalFoodCount(pet)).toBe(3);
    expect(getFoodQty(pet, 'food_apple')).toBe(2);
    expect(getFoodQty(pet, 'food_watermelon')).toBe(0);
  });
});

describe('ownsCosmetic', () => {
  it('reflects the cosmetics inventory', () => {
    const pet = createPetState('capybara');
    expect(ownsCosmetic(pet, 'hat_wool')).toBe(false);
    pet.inventory.cosmetics.push('hat_wool');
    expect(ownsCosmetic(pet, 'hat_wool')).toBe(true);
  });
});
