import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SubjectCard } from '../../src/presentation/components/subject/SubjectCard';

// Mock expo-font since we're not loading real fonts in tests
jest.mock('expo-font', () => ({
  useFonts: () => [true],
  isLoaded: () => true,
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('SubjectCard', () => {
  it('renders the subject name', () => {
    const { getByText } = render(
      <SubjectCard subject="mathematics" stars={3} onPress={() => {}} />,
    );
    expect(getByText('Matemáticas')).toBeTruthy();
  });

  it('renders star count', () => {
    const { getByText } = render(<SubjectCard subject="language" stars={2} onPress={() => {}} />);
    expect(getByText(/2/)).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<SubjectCard subject="science" stars={0} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility label for mathematics', () => {
    const { getByLabelText } = render(
      <SubjectCard subject="mathematics" stars={1} onPress={() => {}} />,
    );
    expect(getByLabelText('Matemáticas: 1 estrella')).toBeTruthy();
  });
});
