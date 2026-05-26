import { useEffect } from 'react';
import { useProgressStore } from '@/infrastructure/store/progressStore';
import { type Subject } from '@/domain/entities/Question';

/**
 * Hook to access the progress data for the active profile.
 */
export function useProgress(activeProfileId: string | null) {
  const store = useProgressStore();

  useEffect(() => {
    store.loadProgress();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeProfileId) {
    return {
      profileProgress: null,
      getStarsForSubject: (_subject: Subject) => 0,
      getTotalStars: () => 0,
      isLoading: store.isLoading,
    };
  }

  return {
    profileProgress: store.getProfileProgress(activeProfileId),
    getStarsForSubject: (subject: Subject) =>
      store.getStarsForSubject(activeProfileId, subject),
    getTotalStars: () => store.getTotalStars(activeProfileId),
    isLoading: store.isLoading,
  };
}
