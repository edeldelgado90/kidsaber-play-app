import {
  purchaseItem,
  InsufficientStarsError,
  AlreadyOwnedError,
} from '../../src/domain/usecases/shop/PurchaseItem';
import { createPetState } from '../../src/domain/entities/Pet';
import { makeInMemoryPetRepo, makeInMemoryEconomyRepo } from '../../test-utils/petFakes';

describe('purchaseItem', () => {
  it('buys food: decrements wallet only and stacks the item', async () => {
    const petRepo = makeInMemoryPetRepo({ p1: createPetState('capybara') });
    const economyRepo = makeInMemoryEconomyRepo({
      p1: { lifetimeStarsEarned: 10, starWalletBalance: 5 },
    });

    // food_apple costs 1
    const pet = await purchaseItem(petRepo, economyRepo, { profileId: 'p1', itemId: 'food_apple' });

    expect(pet.inventory.food).toEqual([{ itemId: 'food_apple', qty: 1 }]);
    const economy = await economyRepo.getProfileEconomy('p1');
    expect(economy).toEqual({ lifetimeStarsEarned: 10, starWalletBalance: 4 });
  });

  it('buys a cosmetic once and adds it to the inventory', async () => {
    const petRepo = makeInMemoryPetRepo({ p1: createPetState('kitten') });
    const economyRepo = makeInMemoryEconomyRepo({
      p1: { lifetimeStarsEarned: 20, starWalletBalance: 20 },
    });

    const pet = await purchaseItem(petRepo, economyRepo, { profileId: 'p1', itemId: 'hat_wool' });
    expect(pet.inventory.cosmetics).toContain('hat_wool');

    await expect(
      purchaseItem(petRepo, economyRepo, { profileId: 'p1', itemId: 'hat_wool' }),
    ).rejects.toBeInstanceOf(AlreadyOwnedError);
  });

  it('throws InsufficientStarsError when the wallet cannot cover the price', async () => {
    const petRepo = makeInMemoryPetRepo({ p1: createPetState('dragon') });
    const economyRepo = makeInMemoryEconomyRepo({
      p1: { lifetimeStarsEarned: 50, starWalletBalance: 2 },
    });

    // hat_wool costs 5
    await expect(
      purchaseItem(petRepo, economyRepo, { profileId: 'p1', itemId: 'hat_wool' }),
    ).rejects.toBeInstanceOf(InsufficientStarsError);

    // nothing changed
    expect(await economyRepo.getProfileEconomy('p1')).toEqual({
      lifetimeStarsEarned: 50,
      starWalletBalance: 2,
    });
    expect((await petRepo.getPet('p1'))?.inventory.cosmetics).toEqual([]);
  });

  it('throws on unknown items and profiles without a pet', async () => {
    const petRepo = makeInMemoryPetRepo({ p1: createPetState('capybara') });
    const economyRepo = makeInMemoryEconomyRepo({
      p1: { lifetimeStarsEarned: 9, starWalletBalance: 9 },
    });

    await expect(
      purchaseItem(petRepo, economyRepo, { profileId: 'p1', itemId: 'nope' }),
    ).rejects.toThrow();
    await expect(
      purchaseItem(petRepo, economyRepo, { profileId: 'p2', itemId: 'food_apple' }),
    ).rejects.toThrow();
  });
});
