import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSoundStore, rehydrateSoundStore } from '../../src/infrastructure/store/soundStore';

const mockAS = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

beforeEach(() => {
  jest.clearAllMocks();
  mockAS.getItem.mockResolvedValue(null);
  mockAS.setItem.mockResolvedValue(undefined);
});

describe('useSoundStore', () => {
  it('starts with isMuted false', () => {
    expect(useSoundStore.getInitialState().isMuted).toBe(false);
  });

  it('toggleMute flips isMuted to true', () => {
    useSoundStore.setState({ isMuted: false });
    useSoundStore.getState().toggleMute();
    expect(useSoundStore.getState().isMuted).toBe(true);
  });

  it('toggleMute flips isMuted back to false', () => {
    useSoundStore.setState({ isMuted: true });
    useSoundStore.getState().toggleMute();
    expect(useSoundStore.getState().isMuted).toBe(false);
  });

  it('toggleMute persists the new value to AsyncStorage', () => {
    useSoundStore.setState({ isMuted: false });
    useSoundStore.getState().toggleMute();
    expect(mockAS.setItem).toHaveBeenCalledWith('@kidsaber/sound_muted', 'true');
  });
});

describe('rehydrateSoundStore', () => {
  it('sets isMuted to true from storage', async () => {
    mockAS.getItem.mockResolvedValue('true');
    useSoundStore.setState({ isMuted: false });
    await rehydrateSoundStore();
    expect(useSoundStore.getState().isMuted).toBe(true);
  });

  it('sets isMuted to false from storage', async () => {
    mockAS.getItem.mockResolvedValue('false');
    useSoundStore.setState({ isMuted: true });
    await rehydrateSoundStore();
    expect(useSoundStore.getState().isMuted).toBe(false);
  });

  it('does not change state when storage returns null', async () => {
    mockAS.getItem.mockResolvedValue(null);
    useSoundStore.setState({ isMuted: false });
    await rehydrateSoundStore();
    expect(useSoundStore.getState().isMuted).toBe(false);
  });

  it('does not throw when storage throws', async () => {
    mockAS.getItem.mockRejectedValue(new Error('storage error'));
    await expect(rehydrateSoundStore()).resolves.toBeUndefined();
  });
});
