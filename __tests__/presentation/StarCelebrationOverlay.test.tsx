import React from 'react';
import { render, act } from '@testing-library/react-native';
import { StarCelebrationOverlay } from '../../src/presentation/components/game/StarCelebrationOverlay';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('StarCelebrationOverlay', () => {
  it('returns null when not visible', () => {
    const { toJSON } = render(<StarCelebrationOverlay visible={false} onHide={() => {}} />);
    expect(toJSON()).toBeNull();
  });

  it('renders star and congratulations text when visible', () => {
    const { getByText } = render(<StarCelebrationOverlay visible onHide={() => {}} />);
    expect(getByText('¡Enhorabuena!')).toBeTruthy();
    expect(getByText('¡Has ganado una estrella!')).toBeTruthy();
  });

  it('calls onHide after display duration', async () => {
    const onHide = jest.fn();
    render(<StarCelebrationOverlay visible onHide={onHide} />);

    await act(async () => {
      jest.runAllTimers();
    });

    expect(onHide).toHaveBeenCalled();
  });
});
