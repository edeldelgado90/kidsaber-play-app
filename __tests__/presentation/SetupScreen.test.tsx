import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

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

jest.mock('../../src/infrastructure/platform/useBreakpoint', () => ({
  useContentWidth: jest.fn(() => 375),
  useHorizontalPadding: jest.fn(() => 16),
  useIsTabletOrWider: jest.fn(() => false),
  useBreakpoint: jest.fn(() => 'phone'),
}));

const mockAddProfile = jest.fn();

jest.mock('../../src/infrastructure/store/profileStore', () => ({
  useProfileStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = { addProfile: mockAddProfile, isLoading: false };
    return selector ? selector(state) : state;
  }),
}));

import { SetupScreen } from '../../src/presentation/screens/SetupScreen';

beforeEach(() => jest.clearAllMocks());

describe('SetupScreen', () => {
  it('renders title text', () => {
    const { getByText } = render(<SetupScreen />);
    expect(getByText('Cuéntanos sobre ti')).toBeTruthy();
  });

  it('renders name input label', () => {
    const { getByText } = render(<SetupScreen />);
    expect(getByText('¿Cómo te llamas?')).toBeTruthy();
  });

  it('renders grade selection label', () => {
    const { getByText } = render(<SetupScreen />);
    expect(getByText('¿En qué curso estás?')).toBeTruthy();
  });

  it('renders 6 grade chips', () => {
    const { getAllByRole } = render(<SetupScreen />);
    const gradeChips = getAllByRole('button');
    expect(gradeChips.length).toBeGreaterThanOrEqual(6);
  });

  it('renders submit button', () => {
    const { getByLabelText } = render(<SetupScreen />);
    expect(getByLabelText('Empezar a jugar')).toBeTruthy();
  });

  it('renders caption text', () => {
    const { getByText } = render(<SetupScreen />);
    expect(getByText('Podrás cambiar estos datos más adelante.')).toBeTruthy();
  });

  it('calls addProfile and navigates on valid submission', async () => {
    mockAddProfile.mockResolvedValue(undefined);
    const { getByLabelText, getByPlaceholderText } = render(<SetupScreen />);

    fireEvent.changeText(getByPlaceholderText('Tu nombre'), 'María');
    fireEvent.press(getByLabelText('1.º de Primaria'));
    await fireEvent.press(getByLabelText('Empezar a jugar'));

    expect(mockAddProfile).toHaveBeenCalledWith('María', 1);
    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith('/(main)/subjects'),
    );
  });

  it('keeps submit disabled when name too short', () => {
    const { getByLabelText, getByPlaceholderText } = render(<SetupScreen />);

    fireEvent.changeText(getByPlaceholderText('Tu nombre'), 'A');
    fireEvent.press(getByLabelText('1.º de Primaria'));

    expect(getByLabelText('Empezar a jugar')).toBeDisabled();
  });

  it('shows validation error when name too long', async () => {
    const { getByLabelText, getByPlaceholderText, findByText } = render(<SetupScreen />);

    fireEvent.changeText(getByPlaceholderText('Tu nombre'), 'A'.repeat(21));
    fireEvent.press(getByLabelText('1.º de Primaria'));
    await fireEvent.press(getByLabelText('Empezar a jugar'));

    expect(await findByText(/El nombre no puede tener más de 20 caracteres\./)).toBeTruthy();
  });

  it('shows error when addProfile throws', async () => {
    mockAddProfile.mockRejectedValue(new Error('Storage error'));
    const { getByLabelText, getByPlaceholderText, findByText } = render(<SetupScreen />);

    fireEvent.changeText(getByPlaceholderText('Tu nombre'), 'Pedro');
    fireEvent.press(getByLabelText('1.º de Primaria'));
    await fireEvent.press(getByLabelText('Empezar a jugar'));

    const err = await findByText(/No se pudo guardar/);
    expect(err).toBeTruthy();
  });
});
