import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MatchingColumn } from '../../src/presentation/components/game/MatchingColumn';
import type { QuestionOption, MatchingAnswer } from '../../src/domain/entities/Question';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

const leftItems: QuestionOption[] = [
  { id: 'l1', text: 'Gato' },
  { id: 'l2', text: 'Perro' },
];
const rightItems: QuestionOption[] = [
  { id: 'r1', text: 'Miau' },
  { id: 'r2', text: 'Guau' },
];

describe('MatchingColumn', () => {
  it('renders both column labels', () => {
    const { getByText } = render(
      <MatchingColumn
        leftItems={leftItems}
        rightItems={rightItems}
        userAnswers={[]}
        onAnswersChange={() => {}}
      />,
    );
    expect(getByText('Columna A')).toBeTruthy();
    expect(getByText('Columna B')).toBeTruthy();
  });

  it('renders left and right items', () => {
    const { getByText } = render(
      <MatchingColumn
        leftItems={leftItems}
        rightItems={rightItems}
        userAnswers={[]}
        onAnswersChange={() => {}}
      />,
    );
    expect(getByText('Gato')).toBeTruthy();
    expect(getByText('Miau')).toBeTruthy();
  });

  it('creates a pair when left then right item is pressed', () => {
    const onAnswersChange = jest.fn();
    const { getByLabelText } = render(
      <MatchingColumn
        leftItems={leftItems}
        rightItems={rightItems}
        userAnswers={[]}
        onAnswersChange={onAnswersChange}
      />,
    );
    fireEvent.press(getByLabelText('Columna A: Gato'));
    fireEvent.press(getByLabelText('Columna B: Miau'));

    expect(onAnswersChange).toHaveBeenCalledWith([{ leftId: 'l1', rightId: 'r1' }]);
  });

  it('deselects left item when pressed twice', () => {
    const onAnswersChange = jest.fn();
    const { getByLabelText } = render(
      <MatchingColumn
        leftItems={leftItems}
        rightItems={rightItems}
        userAnswers={[]}
        onAnswersChange={onAnswersChange}
      />,
    );
    fireEvent.press(getByLabelText('Columna A: Gato'));
    fireEvent.press(getByLabelText('Columna A: Gato')); // deselect
    fireEvent.press(getByLabelText('Columna B: Miau'));

    // Right press without selected left should not call
    expect(onAnswersChange).not.toHaveBeenCalled();
  });

  it('does not respond to left press when disabled', () => {
    const onAnswersChange = jest.fn();
    const { getByLabelText } = render(
      <MatchingColumn
        leftItems={leftItems}
        rightItems={rightItems}
        userAnswers={[]}
        onAnswersChange={onAnswersChange}
        disabled
      />,
    );
    fireEvent.press(getByLabelText('Columna A: Gato'));
    fireEvent.press(getByLabelText('Columna B: Miau'));
    expect(onAnswersChange).not.toHaveBeenCalled();
  });

  it('replaces existing pair when same left is paired again', () => {
    const onAnswersChange = jest.fn();
    const existing: MatchingAnswer[] = [{ leftId: 'l1', rightId: 'r1' }];
    const { getByLabelText } = render(
      <MatchingColumn
        leftItems={leftItems}
        rightItems={rightItems}
        userAnswers={existing}
        onAnswersChange={onAnswersChange}
      />,
    );
    fireEvent.press(getByLabelText('Columna A: Gato, emparejado'));
    fireEvent.press(getByLabelText('Columna B: Guau'));

    const result = (onAnswersChange as jest.Mock).mock.calls[0][0] as MatchingAnswer[];
    expect(result.find(a => a.leftId === 'l1')?.rightId).toBe('r2');
  });
});
