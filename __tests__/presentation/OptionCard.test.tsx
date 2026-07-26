import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OptionCard } from '../../src/presentation/components/game/OptionCard';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

describe('OptionCard', () => {
  it('renders label and text', () => {
    const { getByLabelText } = render(
      <OptionCard label="A" text="Cuatro" state="idle" onPress={() => {}} />,
    );
    expect(getByLabelText('Opción A: Cuatro')).toBeTruthy();
  });

  it('calls onPress in idle state', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <OptionCard label="B" text="Cinco" state="idle" onPress={onPress} />,
    );
    fireEvent.press(getByLabelText('Opción B: Cinco'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress in correct state', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <OptionCard label="A" text="Cuatro" state="correct" onPress={onPress} />,
    );
    fireEvent.press(getByLabelText('Opción A: Cuatro'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress in incorrect state', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <OptionCard label="A" text="Cuatro" state="incorrect" onPress={onPress} />,
    );
    fireEvent.press(getByLabelText('Opción A: Cuatro'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress in disabled state', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <OptionCard label="A" text="Cuatro" state="disabled" onPress={onPress} />,
    );
    fireEvent.press(getByLabelText('Opción A: Cuatro'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders selected state without crashing', () => {
    const { toJSON } = render(
      <OptionCard label="C" text="Seis" state="selected" onPress={() => {}} />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
