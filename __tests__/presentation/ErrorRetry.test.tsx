import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { ErrorRetry } from '../../src/presentation/components/common/ErrorRetry';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'MaterialCommunityIcons' }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

function wrap(element: React.ReactElement) {
  return <PaperProvider>{element}</PaperProvider>;
}

describe('ErrorRetry', () => {
  it('renders default message', () => {
    const { getByText } = render(wrap(<ErrorRetry onRetry={() => {}} />));
    expect(getByText(/No hay conexión/)).toBeTruthy();
  });

  it('renders custom message', () => {
    const { getByText } = render(wrap(<ErrorRetry message="Custom error" onRetry={() => {}} />));
    expect(getByText('Custom error')).toBeTruthy();
  });

  it('calls onRetry when button is pressed', () => {
    const onRetry = jest.fn();
    const { getByLabelText } = render(wrap(<ErrorRetry onRetry={onRetry} />));
    fireEvent.press(getByLabelText('Reintentar cargar las preguntas'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
