/**
 * Nunito font loading configuration for expo-font.
 * Weights: 400, 600, 700, 800
 */
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

export function useKidSaberFonts() {
  return useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    // Register aliases that match RN Paper's font style expectations
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
  });
}

/**
 * Returns the correct Nunito font family string for a given weight.
 * Use this wherever you need to specify fontFamily in StyleSheet.
 */
export function nunitoFamily(weight: '400' | '600' | '700' | '800'): string {
  const map: Record<string, string> = {
    '400': 'Nunito_400Regular',
    '600': 'Nunito_600SemiBold',
    '700': 'Nunito_700Bold',
    '800': 'Nunito_800ExtraBold',
  };
  return map[weight] ?? 'Nunito_400Regular';
}
