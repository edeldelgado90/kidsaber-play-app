/**
 * React Native Paper MD3 theme configuration for KidSaber Play.
 * Extended with brand tokens from colors_and_type.css.
 */
import { MD3LightTheme, MD3DarkTheme, type MD3Theme } from 'react-native-paper';
import { Colors, Radii } from './tokens';
import { nunitoFamily } from './fonts';

// Shared font configuration for Paper
const fontConfig = {
  fontFamily: nunitoFamily('400'),
};

export const KidSaberLightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: nunitoFamily('800'),
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontFamily: nunitoFamily('800'),
    },
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: nunitoFamily('800'),
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: nunitoFamily('700'),
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: nunitoFamily('700'),
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: nunitoFamily('700'),
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: nunitoFamily('700'),
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: nunitoFamily('600'),
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: nunitoFamily('600'),
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: nunitoFamily('400'),
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: nunitoFamily('400'),
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: nunitoFamily('400'),
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: nunitoFamily('700'),
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: nunitoFamily('600'),
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: nunitoFamily('600'),
    },
    default: {
      ...MD3LightTheme.fonts.default,
      fontFamily: fontConfig.fontFamily,
    },
  },
  roundness: Radii.md / 4, // Paper uses a unitless scale (multiplied by 4 internally)
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.brandPrimary,
    primaryContainer: Colors.surfaceHighlight,
    secondary: Colors.brandSecondary,
    secondaryContainer: '#fff3b0',
    surface: Colors.surface,
    surfaceVariant: Colors.surfaceMuted,
    background: Colors.background,
    error: Colors.error,
    errorContainer: Colors.errorSurface,
    onPrimary: Colors.textOnPrimary,
    onSecondary: Colors.textOnSecondary,
    onSurface: Colors.textPrimary,
    onSurfaceVariant: Colors.textSecondary,
    onBackground: Colors.textPrimary,
    outline: Colors.borderSubtle,
    outlineVariant: Colors.borderSubtle,
  },
};

export const KidSaberDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts: KidSaberLightTheme.fonts,
  roundness: KidSaberLightTheme.roundness,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.brandPrimary,
    primaryContainer: Colors.dark.surfaceHighlight,
    secondary: Colors.brandSecondary,
    secondaryContainer: '#3d3100',
    surface: Colors.dark.surface,
    surfaceVariant: Colors.dark.surfaceMuted,
    background: Colors.dark.background,
    error: Colors.error,
    errorContainer: '#4a1a1a',
    onPrimary: Colors.textOnPrimary,
    onSecondary: '#1a1a2e',
    onSurface: Colors.dark.textPrimary,
    onSurfaceVariant: Colors.dark.textSecondary,
    onBackground: Colors.dark.textPrimary,
    outline: Colors.dark.borderSubtle,
    outlineVariant: Colors.dark.borderSubtle,
  },
};
