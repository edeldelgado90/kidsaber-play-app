import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'MaterialCommunityIcons' }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

import { ReportQuestionLink } from '@/presentation/components/game/ReportQuestionLink';

describe('ReportQuestionLink', () => {
  it('invites the player to flag the question when idle', () => {
    const onPress = jest.fn();
    const { getByText, getByLabelText } = render(
      <ReportQuestionLink state="idle" onPress={onPress} />,
    );

    expect(getByText('¿Hay algo mal en esta pregunta?')).toBeTruthy();
    fireEvent.press(getByLabelText('Reportar un error en esta pregunta'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  // Tapping again after a successful report would leave the child unsure it
  // worked, and the API would only bump a counter anyway.
  it('acknowledges a sent report and stops responding', () => {
    const onPress = jest.fn();
    const { getByText, getByLabelText } = render(
      <ReportQuestionLink state="sent" onPress={onPress} />,
    );

    expect(getByText('¡Gracias! Lo revisaremos')).toBeTruthy();
    fireEvent.press(getByLabelText('Pregunta reportada. Gracias'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire again while a report is in flight', () => {
    const onPress = jest.fn();
    const { getByText, getByLabelText } = render(
      <ReportQuestionLink state="sending" onPress={onPress} />,
    );

    expect(getByText('Enviando…')).toBeTruthy();
    fireEvent.press(getByLabelText('Reportar un error en esta pregunta'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('offers a retry after a failure', () => {
    const onPress = jest.fn();
    const { getByText, getByLabelText } = render(
      <ReportQuestionLink state="failed" onPress={onPress} />,
    );

    expect(getByText('No se pudo enviar. Toca para reintentar')).toBeTruthy();
    fireEvent.press(getByLabelText('Reportar un error en esta pregunta'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
