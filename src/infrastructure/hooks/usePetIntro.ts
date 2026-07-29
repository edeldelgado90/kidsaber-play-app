import { useEffect, useState, useCallback } from 'react';
import { AsyncStorageAdapter } from '../../data/storage/AsyncStorageAdapter';
import { StorageKeys } from '../../data/storage/StorageKeys';
import { petRepository } from '../di/container';

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every(v => typeof v === 'string');
}

/**
 * One-time "meet your pet" announcement per profile (update-unlock flow,
 * see 1.Analysis/v1.5/actualizacion-desbloqueo.md).
 *
 * Shows once for profiles that don't have a pet yet; dismissing it (either
 * "choose now" or "later") marks it as seen for that profile.
 */
export function usePetIntro(profileId: string | null) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!profileId) return;
      const [seenIds, pet] = await Promise.all([
        AsyncStorageAdapter.get(StorageKeys.PET_INTRO_SEEN, isStringArray),
        petRepository.getPet(profileId),
      ]);
      if (!cancelled) {
        setShouldShow(!pet && !(seenIds ?? []).includes(profileId));
      }
    };

    setShouldShow(false);
    void check();
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const dismiss = useCallback(async () => {
    setShouldShow(false);
    if (!profileId) return;
    const seenIds =
      (await AsyncStorageAdapter.get(StorageKeys.PET_INTRO_SEEN, isStringArray)) ?? [];
    if (!seenIds.includes(profileId)) {
      await AsyncStorageAdapter.set(StorageKeys.PET_INTRO_SEEN, [...seenIds, profileId]);
    }
  }, [profileId]);

  return { shouldShow, dismiss };
}
