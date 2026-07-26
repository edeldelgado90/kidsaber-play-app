import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfileChip } from '../../src/presentation/components/profile/ProfileChip';
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

const profile: Profile = { id: 'p1', name: 'Ana', grade: 3, createdAt: '2024-01-01T00:00:00.000Z' };

describe('ProfileChip', () => {
  it('renders profile name', () => {
    const { getByText } = render(<ProfileChip profile={profile} />);
    expect(getByText('Ana')).toBeTruthy();
  });

  it('renders grade short label', () => {
    const { getByText } = render(<ProfileChip profile={profile} />);
    expect(getByText('3.º')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(<ProfileChip profile={profile} />);
    expect(getByLabelText('Perfil activo: Ana, 3.º')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<ProfileChip profile={profile} onPress={onPress} />);
    fireEvent.press(getByLabelText('Perfil activo: Ana, 3.º'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders in non-inverted mode without crashing', () => {
    const { toJSON } = render(<ProfileChip profile={profile} inverted={false} />);
    expect(toJSON()).toBeTruthy();
  });
});
