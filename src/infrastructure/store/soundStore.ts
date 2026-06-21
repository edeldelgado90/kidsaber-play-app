import { create } from 'zustand';
import { AsyncStorageAdapter } from '../../data/storage/AsyncStorageAdapter';

const STORAGE_KEY = '@kidsaber/sound_muted';

interface SoundState {
  isMuted: boolean;
  toggleMute: () => void;
}

export const useSoundStore = create<SoundState>((set, get) => ({
  isMuted: false,
  toggleMute: () => {
    const next = !get().isMuted;
    set({ isMuted: next });
    AsyncStorageAdapter.setString(STORAGE_KEY, JSON.stringify(next));
  },
}));

/**
 * Call once inside a useEffect to rehydrate the mute preference from storage.
 * Must NOT be called at module level — AsyncStorage requires a native runtime.
 */
export async function rehydrateSoundStore(): Promise<void> {
  try {
    const val = await AsyncStorageAdapter.getString(STORAGE_KEY);
    if (val !== null) {
      useSoundStore.setState({ isMuted: JSON.parse(val) as boolean });
    }
  } catch {
    // Storage not available — keep default
  }
}
