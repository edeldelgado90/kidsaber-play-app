import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameTypeCard } from '../../src/presentation/components/game/GameTypeCard';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'MaterialCommunityIcons' }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

describe('GameTypeCard', () => {
  it('renders game type label', () => {
    const { getByText } = render(
      <GameTypeCard gameType="option_multiple" stars={0} onPress={() => {}} />,
    );
    expect(getByText('Opción múltiple')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <GameTypeCard gameType="matching" stars={2} onPress={onPress} />,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not show stars when stars=0', () => {
    const { queryByText } = render(
      <GameTypeCard gameType="quick_calculation" stars={0} onPress={() => {}} />,
    );
    // Stars row only rendered when stars > 0 — no star emoji visible
    expect(queryByText(/⭐⭐/)).toBeNull();
  });

  it('shows stars when stars > 0', () => {
    const { getByText } = render(
      <GameTypeCard gameType="quick_calculation" stars={3} onPress={() => {}} />,
    );
    expect(getByText('⭐⭐⭐')).toBeTruthy();
  });
});
