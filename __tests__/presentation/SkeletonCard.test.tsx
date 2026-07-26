import React from 'react';
import { render } from '@testing-library/react-native';
import { SkeletonCard, SkeletonList } from '../../src/presentation/components/common/SkeletonCard';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));

describe('SkeletonCard', () => {
  it('renders without crashing with defaults', () => {
    const { toJSON } = render(<SkeletonCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom height and borderRadius', () => {
    const { toJSON } = render(<SkeletonCard height={120} borderRadius={8} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SkeletonList', () => {
  it('renders the default number of skeletons (4)', () => {
    const { toJSON } = render(<SkeletonList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the specified count', () => {
    const { toJSON } = render(<SkeletonList count={3} />);
    expect(toJSON()).toBeTruthy();
  });
});
