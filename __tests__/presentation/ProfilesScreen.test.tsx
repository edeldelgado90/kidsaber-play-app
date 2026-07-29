import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { Profile } from '../../src/domain/entities/Profile';

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
jest.mock('expo-application', () => ({
  nativeApplicationVersion: '1.2.0',
  nativeBuildVersion: '42',
}));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { version: '1.2.0' } },
}));

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

const profile1: Profile = { id: 'p1', name: 'Ana', grade: 3, createdAt: '' };
const profile2: Profile = { id: 'p2', name: 'Luis', grade: 5, createdAt: '' };

const mockAddProfile = jest.fn();
const mockUpdateProfile = jest.fn();
const mockDeleteProfile = jest.fn();
const mockSetActiveProfile = jest.fn();

jest.mock('../../src/infrastructure/store/profileStore', () => ({
  useProfileStore: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      profiles: [profile1, profile2],
      activeProfileId: 'p1',
      isLoading: false,
      addProfile: mockAddProfile,
      updateProfile: mockUpdateProfile,
      deleteProfile: mockDeleteProfile,
      setActiveProfile: mockSetActiveProfile,
    };
    return selector ? selector(state) : state;
  }),
}));

import { ProfilesScreen } from '../../src/presentation/screens/ProfilesScreen';

beforeEach(() => jest.clearAllMocks());

describe('ProfilesScreen', () => {
  it('renders profile list in default mode', () => {
    const { getByText } = render(<ProfilesScreen />);
    expect(getByText('Ana')).toBeTruthy();
    expect(getByText('Luis')).toBeTruthy();
  });

  it('renders Perfiles header title', () => {
    const { getByText } = render(<ProfilesScreen />);
    expect(getByText('Perfiles')).toBeTruthy();
  });

  it('renders add profile button', () => {
    const { getByLabelText } = render(<ProfilesScreen />);
    expect(getByLabelText('Añadir nuevo perfil')).toBeTruthy();
  });

  it('opens add form when add button pressed', () => {
    const { getByLabelText, getByText } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Añadir nuevo perfil'));
    expect(getByText('Nuevo perfil')).toBeTruthy();
  });

  it('shows name field in add form', () => {
    const { getByLabelText, getByText } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Añadir nuevo perfil'));
    expect(getByText('Nombre')).toBeTruthy();
  });

  it('shows grade chips in add form', () => {
    const { getByLabelText, getAllByRole } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Añadir nuevo perfil'));
    const gradeButtons = getAllByRole('button');
    expect(gradeButtons.length).toBeGreaterThan(0);
  });

  it('returns to list when back pressed in add form', () => {
    const { getByLabelText, getByText } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Añadir nuevo perfil'));
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(getByText('Perfiles')).toBeTruthy();
  });

  it('shows the version footer in list mode and opens /about', () => {
    const { getByLabelText, getByText } = render(<ProfilesScreen />);

    expect(getByText('KidSaber Play v1.2.0 (42)')).toBeTruthy();
    fireEvent.press(getByLabelText('Acerca de KidSaber Play'));

    expect(mockRouter.push).toHaveBeenCalledWith('/about');
  });

  it('hides the version footer in the add form', () => {
    const { getByLabelText, queryByText } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Añadir nuevo perfil'));

    expect(queryByText('KidSaber Play v1.2.0 (42)')).toBeNull();
  });

  it('calls router.back when back pressed in list mode', () => {
    const { getByLabelText } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('calls addProfile when valid form submitted', async () => {
    mockAddProfile.mockResolvedValue(undefined);
    const { getByLabelText, getByPlaceholderText, getByText } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Añadir nuevo perfil'));

    fireEvent.changeText(getByPlaceholderText('Nombre del niño'), 'Carlos');
    fireEvent.press(getByLabelText('1.º de Primaria'));
    // The Paper Button has no accessibilityLabel — its accessible name is its text.
    fireEvent.press(getByText('Guardar'));

    expect(mockAddProfile).toHaveBeenCalledWith('Carlos', 1);
  });

  it('keeps save disabled when name is too short', () => {
    const { getByLabelText, getByPlaceholderText, getByText } = render(<ProfilesScreen />);
    fireEvent.press(getByLabelText('Añadir nuevo perfil'));

    fireEvent.changeText(getByPlaceholderText('Nombre del niño'), 'A');
    fireEvent.press(getByLabelText('1.º de Primaria'));

    expect(getByText('Guardar')).toBeDisabled();
    expect(mockAddProfile).not.toHaveBeenCalled();
  });
});
