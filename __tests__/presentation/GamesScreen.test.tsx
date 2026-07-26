import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'MaterialCommunityIcons' }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: RN.View,
    Svg: RN.View,
    Circle: RN.View,
    Line: RN.View,
    Rect: RN.View,
    Defs: RN.View,
    RadialGradient: RN.View,
    Stop: RN.View,
  };
});

// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ subject: 'mathematics' })),
}));

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

jest.mock('../../src/infrastructure/store/profileStore', () => ({
  useProfileStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = { activeProfileId: 'p1' };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('../../src/infrastructure/store/progressStore', () => {
  const state = {
    getStarsForSubject: () => 1,
    getProfileProgress: () => ({ starsBySubject: {}, starsByGameType: {}, lastSession: null }),
  };
  // GamesScreen reads stars per game type imperatively via `useProgressStore.getState()`,
  // so the mocked hook needs that static method too.
  return {
    useProgressStore: Object.assign(
      jest.fn((selector?: (s: unknown) => unknown) => (selector ? selector(state) : state)),
      { getState: () => state },
    ),
  };
});

jest.mock('../../src/infrastructure/store/soundStore', () => ({
  useSoundStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = { isMuted: false, toggleMute: jest.fn() };
    return selector ? selector(state) : state;
  }),
}));

import { GamesScreen } from '../../src/presentation/screens/GamesScreen';

beforeEach(() => jest.clearAllMocks());

describe('GamesScreen', () => {
  it('renders page title', () => {
    const { getByText } = render(<GamesScreen />);
    expect(getByText('¿Qué tipo de juego?')).toBeTruthy();
  });

  it('renders 4 game type cards for mathematics', () => {
    const { getByText } = render(<GamesScreen />);
    expect(getByText('Opción múltiple')).toBeTruthy();
    expect(getByText('Completar huecos')).toBeTruthy();
    expect(getByText('Emparejar')).toBeTruthy();
    expect(getByText('Cálculo rápido')).toBeTruthy();
  });

  it('calls router.push when game type card is pressed', () => {
    // Target the card itself — `getAllByRole('button')[0]` picks up the header
    // buttons, which navigate elsewhere.
    const { getByLabelText } = render(<GamesScreen />);
    fireEvent.press(getByLabelText(/^Opción múltiple:/));
    expect(mockRouter.push).toHaveBeenCalledWith(
      '/(main)/play/mathematics/option_multiple',
    );
  });

  it('calls router.back when back button pressed', () => {
    const { getByLabelText } = render(<GamesScreen />);
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('renders null when subject is undefined', () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({ subject: undefined });

    const { toJSON } = render(<GamesScreen />);
    expect(toJSON()).toBeNull();
  });
});
