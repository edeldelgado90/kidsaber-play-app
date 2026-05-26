import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@/presentation/theme/ThemeProvider';
import { useKidSaberFonts } from '@/presentation/theme/fonts';

/**
 * Root layout for the KidSaber Play app.
 * Provides: fonts, safe area, Paper theme, status bar.
 */
export default function RootLayout() {
  const [fontsLoaded] = useKidSaberFonts();
  const colorScheme = useColorScheme();

  if (!fontsLoaded) {
    // Fonts loading — Expo Splash Screen handles the visual until ready
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'light'} />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
