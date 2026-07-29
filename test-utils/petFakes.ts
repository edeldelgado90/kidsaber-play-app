import { type IPetRepository } from '../src/domain/ports/IPetRepository';
import { type IEconomyRepository } from '../src/domain/ports/IEconomyRepository';
import { type PetState, type Pets } from '../src/domain/entities/Pet';
import { type Economy, type ProfileEconomy } from '../src/domain/entities/Economy';

/** In-memory fakes shared by the pet/shop usecase tests. */

export function makeInMemoryPetRepo(initial: Record<string, PetState> = {}): IPetRepository {
  const pets: Pets = { byProfileId: { ...initial } };
  return {
    getPets: async () => pets,
    getPet: async profileId => pets.byProfileId[profileId] ?? null,
    savePet: async (profileId, pet) => {
      pets.byProfileId[profileId] = pet;
    },
    resetPet: async profileId => {
      delete pets.byProfileId[profileId];
    },
  };
}

export function makeInMemoryEconomyRepo(
  initial: Record<string, ProfileEconomy> = {},
): IEconomyRepository {
  const economy: Economy = { byProfileId: { ...initial } };
  return {
    getEconomy: async () => economy,
    getProfileEconomy: async profileId => economy.byProfileId[profileId] ?? null,
    saveProfileEconomy: async (profileId, profileEconomy) => {
      economy.byProfileId[profileId] = profileEconomy;
    },
    creditStar: async profileId => {
      const current = economy.byProfileId[profileId] ?? {
        lifetimeStarsEarned: 0,
        starWalletBalance: 0,
      };
      economy.byProfileId[profileId] = {
        lifetimeStarsEarned: current.lifetimeStarsEarned + 1,
        starWalletBalance: current.starWalletBalance + 1,
      };
    },
    resetEconomy: async profileId => {
      delete economy.byProfileId[profileId];
    },
  };
}
