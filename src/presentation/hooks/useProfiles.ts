import { useEffect } from 'react';
import { useProfileStore } from '@/infrastructure/store/profileStore';
import { type Profile } from '@/domain/entities/Profile';

/**
 * Hook that loads profiles on mount and provides profile actions.
 */
export function useProfiles() {
  const store = useProfileStore();

  useEffect(() => {
    if (store.profiles.length === 0 && !store.isLoading) {
      store.loadProfiles();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeProfile: Profile | null = store.getActiveProfile();

  return {
    profiles: store.profiles,
    activeProfile,
    activeProfileId: store.activeProfileId,
    isLoading: store.isLoading,
    error: store.error,
    setActiveProfile: store.setActiveProfile,
    addProfile: store.addProfile,
    updateProfile: store.updateProfile,
    deleteProfile: store.deleteProfile,
    clearError: store.clearError,
  };
}
