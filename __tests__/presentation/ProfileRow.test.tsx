import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfileRow } from '../../src/presentation/components/profile/ProfileRow';
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

const profile: Profile = {
  id: 'p1',
  name: 'Luis',
  grade: 4,
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('ProfileRow', () => {
  it('renders profile name and grade', () => {
    const { getByText } = render(<ProfileRow profile={profile} />);
    expect(getByText('Luis')).toBeTruthy();
    expect(getByText('4.º Primaria')).toBeTruthy();
  });

  it('calls onSelect when row is pressed', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(<ProfileRow profile={profile} onSelect={onSelect} />);
    fireEvent.press(getByLabelText(/Luis/));
    expect(onSelect).toHaveBeenCalledWith(profile);
  });

  it('shows edit button when onEdit provided', () => {
    const { getByLabelText } = render(<ProfileRow profile={profile} onEdit={() => {}} />);
    expect(getByLabelText('Editar perfil de Luis')).toBeTruthy();
  });

  it('calls onEdit when edit button pressed', () => {
    const onEdit = jest.fn();
    const { getByLabelText } = render(<ProfileRow profile={profile} onEdit={onEdit} />);
    fireEvent.press(getByLabelText('Editar perfil de Luis'));
    expect(onEdit).toHaveBeenCalledWith(profile);
  });

  it('shows delete button when onDelete provided and canDelete=true', () => {
    const { getByLabelText } = render(
      <ProfileRow profile={profile} onDelete={() => {}} canDelete />,
    );
    expect(getByLabelText('Eliminar perfil de Luis')).toBeTruthy();
  });

  it('hides delete button when canDelete=false', () => {
    const { queryByLabelText } = render(
      <ProfileRow profile={profile} onDelete={() => {}} canDelete={false} />,
    );
    expect(queryByLabelText('Eliminar perfil de Luis')).toBeNull();
  });

  it('calls onDelete when delete button pressed', () => {
    const onDelete = jest.fn();
    const { getByLabelText } = render(
      <ProfileRow profile={profile} onDelete={onDelete} canDelete />,
    );
    fireEvent.press(getByLabelText('Eliminar perfil de Luis'));
    expect(onDelete).toHaveBeenCalledWith(profile);
  });

  it('accessibility label includes "perfil activo" when isActive', () => {
    const { getByLabelText } = render(<ProfileRow profile={profile} isActive />);
    expect(getByLabelText(/perfil activo/)).toBeTruthy();
  });
});
