import { create } from 'zustand';
import { type Profile } from '../../domain/entities/Profile';
import {
  profileRepository,
  progressRepository,
  petRepository,
  economyRepository,
} from '../di/container';
import { createProfile } from '../../domain/usecases/profile/CreateProfile';
import { updateProfile } from '../../domain/usecases/profile/UpdateProfile';
import { deleteProfile } from '../../domain/usecases/profile/DeleteProfile';

interface ProfileStoreState {
  profiles: Profile[];
  activeProfileId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileStoreActions {
  loadProfiles: () => Promise<void>;
  setActiveProfile: (id: string) => Promise<void>;
  addProfile: (name: string, grade: number) => Promise<void>;
  updateProfile: (id: string, name?: string, grade?: number) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  clearError: () => void;
  getActiveProfile: () => Profile | null;
}

export type ProfileStore = ProfileStoreState & ProfileStoreActions;

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  activeProfileId: null,
  isLoading: false,
  error: null,

  loadProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const [profiles, activeProfileId] = await Promise.all([
        profileRepository.getAll(),
        profileRepository.getActiveProfileId(),
      ]);
      set({ profiles, activeProfileId, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Error al cargar los perfiles.' });
    }
  },

  setActiveProfile: async (id: string) => {
    await profileRepository.setActiveProfileId(id);
    set({ activeProfileId: id });
  },

  addProfile: async (name: string, grade: number) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = await createProfile(profileRepository, { name, grade });
      set(state => ({
        profiles: [...state.profiles, profile],
        activeProfileId: profile.id,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear el perfil.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  updateProfile: async (id: string, name?: string, grade?: number) => {
    set({ isLoading: true, error: null });
    try {
      await updateProfile(profileRepository, { id, name, grade });
      const profiles = await profileRepository.getAll();
      set({ profiles, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el perfil.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  deleteProfile: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProfile(
        profileRepository,
        progressRepository,
        petRepository,
        economyRepository,
        id,
      );
      const [profiles, activeProfileId] = await Promise.all([
        profileRepository.getAll(),
        profileRepository.getActiveProfileId(),
      ]);
      set({ profiles, activeProfileId, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar el perfil.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),

  getActiveProfile: () => {
    const { profiles, activeProfileId } = get();
    return profiles.find(p => p.id === activeProfileId) ?? null;
  },
}));
