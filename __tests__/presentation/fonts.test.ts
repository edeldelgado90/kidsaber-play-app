import { nunitoFamily } from '../../src/presentation/theme/fonts';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

describe('nunitoFamily', () => {
  it('returns Nunito_400Regular for weight 400', () => {
    expect(nunitoFamily('400')).toBe('Nunito_400Regular');
  });

  it('returns Nunito_600SemiBold for weight 600', () => {
    expect(nunitoFamily('600')).toBe('Nunito_600SemiBold');
  });

  it('returns Nunito_700Bold for weight 700', () => {
    expect(nunitoFamily('700')).toBe('Nunito_700Bold');
  });

  it('returns Nunito_800ExtraBold for weight 800', () => {
    expect(nunitoFamily('800')).toBe('Nunito_800ExtraBold');
  });

  it('falls back to Nunito_400Regular for unknown weight', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(nunitoFamily('900' as any)).toBe('Nunito_400Regular');
  });
});
