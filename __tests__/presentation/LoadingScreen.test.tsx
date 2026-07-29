import React from 'react';
import { render, act } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
}));

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

const mockLoadProfiles = jest.fn().mockResolvedValue(undefined);
const mockLoadProgress = jest.fn().mockResolvedValue(undefined);

let mockProfilesState: { profiles: unknown[] } = { profiles: [] };

jest.mock('../../src/infrastructure/store/profileStore', () => ({
  // LoadingScreen reads the profile list imperatively via `useProfileStore.getState()`,
  // so the mocked hook needs that static method too.
  useProfileStore: Object.assign(
    jest.fn((selector?: (s: unknown) => unknown) => {
      const state = { loadProfiles: mockLoadProfiles, profiles: [] };
      return selector ? selector(state) : state;
    }),
    { getState: () => mockProfilesState },
  ),
}));

jest.mock('../../src/infrastructure/store/progressStore', () => ({
  useProgressStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = { loadProgress: mockLoadProgress };
    return selector ? selector(state) : state;
  }),
}));

const mockEnsureSeededAndLoad = jest.fn().mockResolvedValue(undefined);

jest.mock('../../src/infrastructure/store/economyStore', () => ({
  // LoadingScreen uses the economy store imperatively via getState()
  useEconomyStore: Object.assign(jest.fn(), {
    getState: () => ({ ensureSeededAndLoad: mockEnsureSeededAndLoad }),
  }),
}));

jest.mock('../../src/infrastructure/platform/useBreakpoint', () => ({
  useContentWidth: jest.fn(() => 375),
  useHorizontalPadding: jest.fn(() => 16),
  useIsTabletOrWider: jest.fn(() => false),
  useBreakpoint: jest.fn(() => 'phone'),
}));

import { LoadingScreen } from '../../src/presentation/screens/LoadingScreen';

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockProfilesState = { profiles: [] };
  mockLoadProfiles.mockResolvedValue(undefined);
  mockLoadProgress.mockResolvedValue(undefined);
  mockEnsureSeededAndLoad.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('LoadingScreen', () => {
  it('renders KidSaber Play text', () => {
    const { getByText } = render(<LoadingScreen />);
    expect(getByText('KidSaber Play')).toBeTruthy();
  });

  it('renders logo image', () => {
    const { getByLabelText } = render(<LoadingScreen />);
    expect(getByLabelText('KidSaber Play')).toBeTruthy();
  });

  // The logo pulse is an infinite `Animated.loop`, so `jest.runAllTimers()` never
  // settles. Flush the data-loading promise, then advance past the minimum splash
  // duration (1800ms) so only the navigation timeout fires.
  const flushSplash = async () => {
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
  };

  it('navigates to setup when no profiles exist', async () => {
    mockProfilesState = { profiles: [] };

    render(<LoadingScreen />);
    await flushSplash();

    expect(mockRouter.replace).toHaveBeenCalledWith('/(onboarding)/setup');
  });

  it('navigates to subjects when profiles exist', async () => {
    mockProfilesState = { profiles: [{ id: 'p1', name: 'Ana', grade: 3, createdAt: '' }] };

    render(<LoadingScreen />);
    await flushSplash();

    expect(mockRouter.replace).toHaveBeenCalledWith('/(main)/subjects');
  });
});
