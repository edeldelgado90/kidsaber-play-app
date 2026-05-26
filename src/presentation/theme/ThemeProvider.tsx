import React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { KidSaberLightTheme, KidSaberDarkTheme } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with the KidSaber Paper theme.
 * Automatically switches between light and dark based on system preference.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? KidSaberDarkTheme : KidSaberLightTheme;

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
