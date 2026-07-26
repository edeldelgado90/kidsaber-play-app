import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { QuestionProgressBar } from '../../src/presentation/components/game/QuestionProgressBar';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

describe('QuestionProgressBar', () => {
  it('renders "Pregunta 3/10"', () => {
    const { getByText } = render(
      <PaperProvider>
        <QuestionProgressBar current={3} total={10} />
      </PaperProvider>,
    );
    expect(getByText('Pregunta 3/10')).toBeTruthy();
  });

  it('renders without crashing when total is 0', () => {
    const { toJSON } = render(
      <PaperProvider>
        <QuestionProgressBar current={0} total={0} />
      </PaperProvider>,
    );
    expect(toJSON()).toBeTruthy();
  });
});
