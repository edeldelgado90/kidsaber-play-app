import { create } from 'zustand';
import {
  type PetState,
  type PetSpeciesId,
  type EquipSlot,
  getTotalFoodCount,
} from '../../domain/entities/Pet';
import { choosePetSpecies } from '../../domain/usecases/pet/ChoosePetSpecies';
import { feedPet } from '../../domain/usecases/pet/FeedPet';
import { equipItem } from '../../domain/usecases/pet/EquipItem';
import { purchaseItem } from '../../domain/usecases/shop/PurchaseItem';
import { petRepository, economyRepository } from '../di/container';
import { useEconomyStore } from './economyStore';

interface PetStoreState {
  /** Pet of the currently loaded profile (null = profile has no pet yet). */
  pet: PetState | null;
  profileId: string | null;
  isLoading: boolean;
}

interface PetStoreActions {
  loadPet: (profileId: string) => Promise<void>;
  chooseSpecies: (profileId: string, speciesId: PetSpeciesId) => Promise<void>;
  feed: (itemId: string) => Promise<void>;
  equip: (slot: EquipSlot, itemId: string | null) => Promise<void>;
  purchase: (itemId: string) => Promise<void>;
  getFoodCount: () => number;
}

export type PetStore = PetStoreState & PetStoreActions;

export const usePetStore = create<PetStore>((set, get) => ({
  pet: null,
  profileId: null,
  isLoading: false,

  loadPet: async (profileId: string) => {
    set({ isLoading: true, profileId });
    try {
      const pet = await petRepository.getPet(profileId);
      set({ pet, isLoading: false });
    } catch {
      set({ pet: null, isLoading: false });
    }
  },

  chooseSpecies: async (profileId: string, speciesId: PetSpeciesId) => {
    const pet = await choosePetSpecies(petRepository, { profileId, speciesId });
    set({ pet, profileId });
  },

  feed: async (itemId: string) => {
    const { profileId } = get();
    if (!profileId) return;
    const pet = await feedPet(petRepository, { profileId, itemId });
    set({ pet });
  },

  equip: async (slot: EquipSlot, itemId: string | null) => {
    const { profileId } = get();
    if (!profileId) return;
    const pet = await equipItem(petRepository, { profileId, slot, itemId });
    set({ pet });
  },

  purchase: async (itemId: string) => {
    const { profileId } = get();
    if (!profileId) return;
    const pet = await purchaseItem(petRepository, economyRepository, { profileId, itemId });
    set({ pet });
    // Wallet balance changed — refresh the economy store
    await useEconomyStore.getState().loadEconomy();
  },

  getFoodCount: (): number => {
    const { pet } = get();
    return pet ? getTotalFoodCount(pet) : 0;
  },
}));
