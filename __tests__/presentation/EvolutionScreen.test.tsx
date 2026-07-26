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
}));

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

const activeProfile: Profile = {
  id: 'p1',
  name: 'Luis',
  grade: 5,
  createdAt: '2024-01-01T00:00:00.000Z',
};

jest.mock('../../src/infrastructure/store/profileStore', () => ({
  useProfileStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      activeProfileId: 'p1',
      getActiveProfile: () => activeProfile,
    };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('../../src/infrastructure/store/progressStore', () => ({
  useProgressStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      getStarsForSubject: () => 3,
      getTotalStars: () => 12,
    };
    return selector ? selector(state) : state;
  }),
}));

import { EvolutionScreen } from '../../src/presentation/screens/EvolutionScreen';

beforeEach(() => jest.clearAllMocks());

describe('EvolutionScreen', () => {
  it('renders profile name', () => {
    const { getByText } = render(<EvolutionScreen />);
    expect(getByText('Luis')).toBeTruthy();
  });

  it('renders ESTRELLAS POR ASIGNATURA section', () => {
    const { getByText } = render(<EvolutionScreen />);
    expect(getByText(/ESTRELLAS POR ASIGNATURA/)).toBeTruthy();
  });

  it('renders total stars card', () => {
    const { getByText } = render(<EvolutionScreen />);
    expect(getByText(/Total: 12 estrellas/)).toBeTruthy();
  });

  it('navigates back when back button pressed', () => {
    const { getByLabelText } = render(<EvolutionScreen />);
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('navigates to subjects when home button pressed', () => {
    const { getByLabelText } = render(<EvolutionScreen />);
    fireEvent.press(getByLabelText('Ir a inicio'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/(main)/subjects');
  });
});
