import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FillBlankStatement } from '../../src/presentation/components/game/FillBlankStatement';
import type { QuestionOption } from '../../src/domain/entities/Question';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
jest.mock('@expo-google-fonts/nunito', () => ({
  useFonts: jest.fn(() => [true, null]),
  Nunito_400Regular: 'Nunito_400Regular',
  Nunito_600SemiBold: 'Nunito_600SemiBold',
  Nunito_700Bold: 'Nunito_700Bold',
  Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

const options: QuestionOption[] = [
  { id: 'opt-a', text: 'perro' },
  { id: 'opt-b', text: 'gato' },
];

describe('FillBlankStatement', () => {
  it('renders statement with blank placeholder when no option selected', () => {
    const { getByText } = render(
      <FillBlankStatement
        statement="El ____ ladra"
        options={options}
        selectedId={null}
        onSelect={() => {}}
      />,
    );
    expect(getByText(/El/)).toBeTruthy();
  });

  it('renders option chips', () => {
    const { getByLabelText } = render(
      <FillBlankStatement
        statement="El ____ ladra"
        options={options}
        selectedId={null}
        onSelect={() => {}}
      />,
    );
    expect(getByLabelText('Opción: perro')).toBeTruthy();
    expect(getByLabelText('Opción: gato')).toBeTruthy();
  });

  it('calls onSelect with option id when chip pressed', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <FillBlankStatement
        statement="El ____ ladra"
        options={options}
        selectedId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(getByLabelText('Opción: perro'));
    expect(onSelect).toHaveBeenCalledWith('opt-a');
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <FillBlankStatement
        statement="El ____ ladra"
        options={options}
        selectedId={null}
        onSelect={onSelect}
        disabled
      />,
    );
    fireEvent.press(getByLabelText('Opción: perro'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows selected option text in the statement', () => {
    const { getByText } = render(
      <FillBlankStatement
        statement="El ____ ladra"
        options={options}
        selectedId="opt-a"
        onSelect={() => {}}
      />,
    );
    expect(getByText(/ perro /)).toBeTruthy();
  });
});
