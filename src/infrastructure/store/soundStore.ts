import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'kidsaber:sound:muted';

interface SoundState {
  isMuted: boolean;
  toggleMute: () => void;
}

export const useSoundStore = create<SoundState>((set, get) => ({
  isMuted: false,
  toggleMute: () => {
    const next = !get().isMuted;
    set({ isMuted: next });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
}));

/**
 * Call once inside a useEffect to rehydrate the mute preference from storage.
 * Must NOT be called at module level — AsyncStorage requires a native runtime.
 */
export async function rehydrateSoundStore(): Promise<void> {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEY);
    if (val !== null) {
      useSoundStore.setState({ isMuted: JSON.parse(val) as boolean });
    }
  } catch {
    // Storage not available — keep default
  }
}
