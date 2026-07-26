import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SubjectProgressRow } from '../../src/presentation/components/evolution/SubjectProgressRow';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: 'MaterialCommunityIcons' }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

describe('SubjectProgressRow', () => {
  it('renders subject label for mathematics', () => {
    const { getByText } = render(<SubjectProgressRow subject="mathematics" stars={2} />);
    expect(getByText('Matemáticas')).toBeTruthy();
  });

  it('renders the star count', () => {
    const { getByText } = render(<SubjectProgressRow subject="language" stars={5} />);
    expect(getByText('5')).toBeTruthy();
  });

  it('caps display count at 99', () => {
    const { getByText } = render(<SubjectProgressRow subject="science" stars={100} />);
    expect(getByText('99')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <SubjectProgressRow subject="mathematics" stars={0} onPress={onPress} />,
    );
    fireEvent.press(getByLabelText('Jugar Matemáticas'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('has no button role when onPress is not provided', () => {
    const { queryByLabelText } = render(<SubjectProgressRow subject="english" stars={1} />);
    expect(queryByLabelText('Jugar Inglés')).toBeNull();
  });
});
