import React from 'react';
import { render, act } from '@testing-library/react-native';
import { GameFeedbackOverlay } from '../../src/presentation/components/game/GameFeedbackOverlay';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'MaterialCommunityIcons' }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('GameFeedbackOverlay', () => {
  it('returns null when visible is false', () => {
    const { toJSON } = render(
      <GameFeedbackOverlay visible={false} isCorrect onHide={() => {}} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('shows ¡Correcto! when visible and correct', () => {
    const { getByText } = render(
      <GameFeedbackOverlay visible isCorrect onHide={() => {}} />,
    );
    expect(getByText(/Correcto/)).toBeTruthy();
  });

  it('shows ¡Casi! when visible and incorrect', () => {
    const { getByText } = render(
      <GameFeedbackOverlay visible isCorrect={false} onHide={() => {}} />,
    );
    expect(getByText(/Casi/)).toBeTruthy();
  });

  it('shows correctAnswerText when incorrect and text provided', () => {
    const { getByText } = render(
      <GameFeedbackOverlay
        visible
        isCorrect={false}
        correctAnswerText="La respuesta es Madrid"
        onHide={() => {}}
      />,
    );
    expect(getByText(/La respuesta es Madrid/)).toBeTruthy();
  });

  it('calls onHide after the display duration', async () => {
    const onHide = jest.fn();
    render(<GameFeedbackOverlay visible isCorrect onHide={onHide} />);

    await act(async () => {
      jest.runAllTimers();
    });

    expect(onHide).toHaveBeenCalled();
  });
});
