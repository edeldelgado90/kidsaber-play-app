import { create } from 'zustand';
import { type Economy, createEmptyProfileEconomy } from '../../domain/entities/Economy';
import { ensureEconomySeeded } from '../../domain/usecases/economy/EnsureEconomySeeded';
import { economyRepository, progressRepository } from '../di/container';

interface EconomyStoreState {
  economy: Economy;
  isLoading: boolean;
}

interface EconomyStoreActions {
  loadEconomy: () => Promise<void>;
  /** Seeds economy for profiles that predate the pet update, then loads. */
  ensureSeededAndLoad: (profileIds: string[]) => Promise<void>;
  getWalletBalance: (profileId: string) => number;
  getLifetimeStars: (profileId: string) => number;
}

export type EconomyStore = EconomyStoreState & EconomyStoreActions;

export const useEconomyStore = create<EconomyStore>((set, get) => ({
  economy: { byProfileId: {} },
  isLoading: false,

  loadEconomy: async () => {
    set({ isLoading: true });
    try {
      const economy = await economyRepository.getEconomy();
      set({ economy, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  ensureSeededAndLoad: async (profileIds: string[]) => {
    set({ isLoading: true });
    try {
      await ensureEconomySeeded(economyRepository, progressRepository, profileIds);
      const economy = await economyRepository.getEconomy();
      set({ economy, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  getWalletBalance: (profileId: string): number => {
    const profileEconomy = get().economy.byProfileId[profileId] ?? createEmptyProfileEconomy();
    return profileEconomy.starWalletBalance;
  },

  getLifetimeStars: (profileId: string): number => {
    const profileEconomy = get().economy.byProfileId[profileId] ?? createEmptyProfileEconomy();
    return profileEconomy.lifetimeStarsEarned;
  },
}));
