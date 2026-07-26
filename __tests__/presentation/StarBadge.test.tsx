import React from 'react';
import { render } from '@testing-library/react-native';
import { StarBadge } from '../../src/presentation/components/evolution/StarBadge';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));

describe('StarBadge', () => {
  it('renders with earned=true and correct accessibility label', () => {
    const { getByLabelText } = render(<StarBadge earned />);
    expect(getByLabelText('Estrella ganada')).toBeTruthy();
  });

  it('renders with earned=false and correct accessibility label', () => {
    const { getByLabelText } = render(<StarBadge earned={false} />);
    expect(getByLabelText('Sin estrella')).toBeTruthy();
  });

  it('renders with animate=true without crashing', () => {
    const { toJSON } = render(<StarBadge earned animate />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom size without crashing', () => {
    const { toJSON } = render(<StarBadge earned size={48} />);
    expect(toJSON()).toBeTruthy();
  });
});
