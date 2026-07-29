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

// Each factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, so a factory referencing an outer `const` would read it in its TDZ.
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
}));
jest.mock('expo-linking', () => ({ openURL: jest.fn(() => Promise.resolve(true)) }));
jest.mock('@/infrastructure/config/appInfo', () => ({
  AppInfo: {
    name: 'KidSaber Play',
    version: '1.2.0',
    buildNumber: '42',
    versionLabel: '1.2.0 (42)',
    supportEmail: 'hola@example.com',
    copyright: '© 2026 KidSaber Play',
    license: 'MIT',
  },
}));

import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { AppInfo } from '@/infrastructure/config/appInfo';
import { AboutScreen } from '@/presentation/screens/AboutScreen';

const mockRouter = router as jest.Mocked<typeof router>;
const mockOpenURL = Linking.openURL as jest.MockedFunction<typeof Linking.openURL>;
// AppInfo is frozen `as const` in production; the mock is a plain object, so
// tests can flip a field to exercise the "no email configured" branch.
const mutableAppInfo = AppInfo as unknown as { supportEmail: string };

describe('AboutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mutableAppInfo.supportEmail = 'hola@example.com';
  });

  it('shows the app name, version with build number and legal line', () => {
    const { getByText } = render(<AboutScreen />);

    expect(getByText('KidSaber Play')).toBeTruthy();
    expect(getByText('Versión 1.2.0 (42)')).toBeTruthy();
    expect(getByText('© 2026 KidSaber Play · Licencia MIT')).toBeTruthy();
  });

  it('opens the mail client when the contact row is pressed', () => {
    const { getByLabelText } = render(<AboutScreen />);

    fireEvent.press(getByLabelText('Escribir a hola@example.com'));

    expect(mockOpenURL).toHaveBeenCalledWith('mailto:hola@example.com');
  });

  it('hides the contact row when no address is configured', () => {
    mutableAppInfo.supportEmail = '';

    const { queryByText } = render(<AboutScreen />);

    expect(queryByText('Contacto')).toBeNull();
    expect(queryByText('Versión 1.2.0 (42)')).toBeTruthy();
  });

  it('goes back when the header back button is pressed', () => {
    const { getByLabelText } = render(<AboutScreen />);

    fireEvent.press(getByLabelText('Volver atrás'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
