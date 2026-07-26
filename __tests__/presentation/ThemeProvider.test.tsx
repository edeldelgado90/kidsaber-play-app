import React from 'react';
import { Text, useColorScheme } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../../src/presentation/theme/ThemeProvider';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));
// Mock the underlying module rather than spreading the `react-native` index:
// spreading eagerly evaluates every lazy getter, which pulls in native-only
// modules (DevMenu, Clipboard, ...) that are unavailable under Jest.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'),
}));

describe('ThemeProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Text>Child content</Text>
      </ThemeProvider>,
    );
    expect(getByText('Child content')).toBeTruthy();
  });

  it('renders with dark color scheme without crashing', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { getByText } = render(
      <ThemeProvider>
        <Text>Dark mode</Text>
      </ThemeProvider>,
    );
    expect(getByText('Dark mode')).toBeTruthy();
  });
});
