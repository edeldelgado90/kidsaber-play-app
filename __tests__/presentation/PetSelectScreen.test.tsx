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
    G: RN.View,
    Path: RN.View,
    Circle: RN.View,
    Ellipse: RN.View,
    Line: RN.View,
    Rect: RN.View,
    Defs: RN.View,
    RadialGradient: RN.View,
    LinearGradient: RN.View,
    Stop: RN.View,
  };
});

// The factory must be self-contained: jest hoists `jest.mock` above the ESM
// imports, and those imports run before any module-level `const`, so a factory
// referencing outer variables would capture them as `undefined`.
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
}));

// In-memory DI container: avoids loading firebase and persists pets per test file.
jest.mock('../../src/infrastructure/di/container', () => {
  const pets: Record<string, unknown> = {};
  return {
    profileRepository: {},
    progressRepository: {},
    questionsService: {},
    petRepository: {
      getPets: jest.fn(async () => ({ byProfileId: pets })),
      getPet: jest.fn(async (id: string) => pets[id] ?? null),
      savePet: jest.fn(async (id: string, pet: unknown) => {
        pets[id] = pet;
      }),
      resetPet: jest.fn(),
    },
    economyRepository: {
      getEconomy: jest.fn(async () => ({ byProfileId: {} })),
      getProfileEconomy: jest.fn(),
      saveProfileEconomy: jest.fn(),
      creditStar: jest.fn(),
      resetEconomy: jest.fn(),
    },
  };
});

import { router } from 'expo-router';

const mockRouter = router as jest.Mocked<typeof router>;

import { PetSelectScreen } from '../../src/presentation/screens/PetSelectScreen';
import { useProfileStore } from '../../src/infrastructure/store/profileStore';
import { usePetStore } from '../../src/infrastructure/store/petStore';

beforeEach(() => {
  jest.clearAllMocks();
  useProfileStore.setState({ activeProfileId: 'p1' });
  usePetStore.setState({ pet: null, profileId: null, isLoading: false });
});

describe('PetSelectScreen', () => {
  it('renders the three selectable species', () => {
    const { getByText } = render(<PetSelectScreen />);
    expect(getByText('Capi')).toBeTruthy();
    expect(getByText('Michi')).toBeTruthy();
    expect(getByText('Chispa')).toBeTruthy();
  });

  it('keeps confirm disabled until a species is selected', () => {
    const { getByText } = render(<PetSelectScreen />);
    expect(getByText('Elige una mascota')).toBeTruthy();

    fireEvent.press(getByText('Capi'));
    expect(getByText('¡Este quiero!')).toBeTruthy();
  });

  it('assigns the pet and opens the pet home on confirm', async () => {
    const { getByText } = render(<PetSelectScreen />);

    fireEvent.press(getByText('Capi'));
    fireEvent.press(getByText('¡Este quiero!'));

    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/(main)/pet'));
    expect(usePetStore.getState().pet?.speciesId).toBe('capybara');
  });

  it('calls router.back when back button pressed', () => {
    const { getByLabelText } = render(<PetSelectScreen />);
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
