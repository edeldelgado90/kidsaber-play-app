import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AppHeader } from '../../src/presentation/components/common/AppHeader';

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

describe('AppHeader', () => {
  it('renders title when provided', () => {
    const { getByText } = render(<AppHeader title="Mi pantalla" />);
    expect(getByText('Mi pantalla')).toBeTruthy();
  });

  it('renders back button when onBack is provided', () => {
    const { getByLabelText } = render(<AppHeader onBack={() => {}} />);
    expect(getByLabelText('Volver atrás')).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(<AppHeader onBack={onBack} />);
    fireEvent.press(getByLabelText('Volver atrás'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders evolution button when onEvolution provided', () => {
    const { getByLabelText } = render(<AppHeader onEvolution={() => {}} />);
    expect(getByLabelText('Ver mi evolución')).toBeTruthy();
  });

  it('calls onEvolution when pressed', () => {
    const onEvolution = jest.fn();
    const { getByLabelText } = render(<AppHeader onEvolution={onEvolution} />);
    fireEvent.press(getByLabelText('Ver mi evolución'));
    expect(onEvolution).toHaveBeenCalledTimes(1);
  });

  it('renders pet button when onPet provided', () => {
    const { getByLabelText } = render(<AppHeader onPet={() => {}} />);
    expect(getByLabelText('Ver mascota')).toBeTruthy();
  });

  it('renders sound toggle button when showSoundToggle is true', () => {
    const { getByLabelText } = render(<AppHeader showSoundToggle onSoundToggle={() => {}} />);
    expect(getByLabelText('Silenciar')).toBeTruthy();
  });

  it('shows activate sound label when isMuted is true', () => {
    const { getByLabelText } = render(
      <AppHeader showSoundToggle isMuted onSoundToggle={() => {}} />,
    );
    expect(getByLabelText('Activar sonido')).toBeTruthy();
  });

  it('calls onSoundToggle when sound button pressed', () => {
    const onToggle = jest.fn();
    const { getByLabelText } = render(
      <AppHeader showSoundToggle isMuted={false} onSoundToggle={onToggle} />,
    );
    fireEvent.press(getByLabelText('Silenciar'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders leftSlot content when provided', () => {
    const { getByText } = render(<AppHeader leftSlot={<Text>{'Slot content'}</Text>} />);
    expect(getByText('Slot content')).toBeTruthy();
  });

  it('renders white mode without crashing', () => {
    const { toJSON } = render(<AppHeader white title="Blanco" />);
    expect(toJSON()).toBeTruthy();
  });
});
