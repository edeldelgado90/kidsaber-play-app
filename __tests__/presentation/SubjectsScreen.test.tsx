import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { Profile } from '../../src/domain/entities/Profile';

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
    G: RN.View,
    Path: RN.View,
    Ellipse: RN.View,
    Circle: RN.View,
    Line: RN.View,
    Rect: RN.View,
    Defs: RN.View,
    RadialGradient: RN.View,
    Stop: RN.View,
  };
});

// Avoid pulling the real DI container (firebase) through the pet intro hook.
jest.mock('../../src/infrastructure/hooks/usePetIntro', () => ({
  usePetIntro: () => ({ shouldShow: false, dismiss: jest.fn() }),
}));

// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
}));

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

const activeProfile: Profile = {
  id: 'p1',
  name: 'Ana',
  grade: 3,
  createdAt: '2024-01-01T00:00:00.000Z',
};

jest.mock('../../src/infrastructure/store/profileStore', () => ({
  useProfileStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      profiles: [activeProfile],
      activeProfileId: 'p1',
      getActiveProfile: () => activeProfile,
    };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('../../src/infrastructure/store/progressStore', () => ({
  useProgressStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      getStarsForSubject: () => 2,
      getTotalStars: () => 8,
    };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('../../src/infrastructure/store/soundStore', () => ({
  useSoundStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = { isMuted: false, toggleMute: jest.fn() };
    return selector ? selector(state) : state;
  }),
}));

import { SubjectsScreen } from '../../src/presentation/screens/SubjectsScreen';

beforeEach(() => jest.clearAllMocks());

describe('SubjectsScreen', () => {
  it('renders greeting with profile name', () => {
    const { getByText } = render(<SubjectsScreen />);
    expect(getByText(/Hola, Ana/)).toBeTruthy();
  });

  it('renders all 4 subject cards', () => {
    const { getByText } = render(<SubjectsScreen />);
    expect(getByText('Matemáticas')).toBeTruthy();
    expect(getByText('Lengua')).toBeTruthy();
    expect(getByText('Naturales')).toBeTruthy();
    expect(getByText('Inglés')).toBeTruthy();
  });

  it('renders total stars text', () => {
    const { getByText } = render(<SubjectsScreen />);
    expect(getByText(/Total: 8 estrellas/)).toBeTruthy();
  });

  it('navigates to games screen when subject card is pressed', () => {
    const { getAllByRole } = render(<SubjectsScreen />);
    const buttons = getAllByRole('button');
    // First 4 buttons from subject cards
    fireEvent.press(buttons[0]);
    expect(mockRouter.push).toHaveBeenCalled();
  });

  it('navigates to evolution when evolution button pressed', () => {
    const { getByLabelText } = render(<SubjectsScreen />);
    fireEvent.press(getByLabelText('Ver mi evolución'));
    expect(mockRouter.push).toHaveBeenCalledWith('/(main)/evolution');
  });

  it('navigates to pet when pet button pressed', () => {
    const { getByLabelText } = render(<SubjectsScreen />);
    fireEvent.press(getByLabelText('Ver mascota'));
    expect(mockRouter.push).toHaveBeenCalledWith('/(main)/pet');
  });
});
