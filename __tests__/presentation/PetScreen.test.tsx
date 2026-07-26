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
}));

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

import { PetScreen } from '../../src/presentation/screens/PetScreen';

beforeEach(() => jest.clearAllMocks());

describe('PetScreen', () => {
  it('renders ¡Próximamente!', () => {
    const { getByText } = render(<PetScreen />);
    expect(getByText('¡Próximamente!')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(<PetScreen />);
    expect(getByText(/Gana estrellas/)).toBeTruthy();
  });

  it('calls router.back when back button pressed', () => {
    const { getByLabelText } = render(<PetScreen />);
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
