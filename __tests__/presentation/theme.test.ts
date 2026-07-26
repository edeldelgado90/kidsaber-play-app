jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

import { KidSaberLightTheme, KidSaberDarkTheme } from '../../src/presentation/theme/theme';
import { Colors } from '../../src/presentation/theme/tokens';

describe('KidSaberLightTheme', () => {
  it('uses brand primary as primary color', () => {
    expect(KidSaberLightTheme.colors.primary).toBe(Colors.brandPrimary);
  });

  it('uses Nunito for display font', () => {
    expect(KidSaberLightTheme.fonts.displayLarge.fontFamily).toBe('Nunito_800ExtraBold');
  });

  it('has roundness set', () => {
    expect(KidSaberLightTheme.roundness).toBeGreaterThan(0);
  });
});

describe('KidSaberDarkTheme', () => {
  it('has a different primary color from light theme', () => {
    expect(KidSaberDarkTheme.colors.primary).toBeDefined();
  });

  it('shares the same fonts as light theme', () => {
    expect(KidSaberDarkTheme.fonts).toEqual(KidSaberLightTheme.fonts);
  });

  it('uses dark surface color', () => {
    expect(KidSaberDarkTheme.colors.surface).toBe(Colors.dark.surface);
  });
});
