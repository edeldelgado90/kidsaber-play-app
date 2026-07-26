import React from 'react';
import { Text, useWindowDimensions } from 'react-native';
import { render } from '@testing-library/react-native';
import { ContentContainer } from '../../src/presentation/components/common/ContentContainer';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
// Mock the underlying module rather than spreading the `react-native` index:
// spreading eagerly evaluates every lazy getter, which pulls in native-only
// modules (DevMenu, Clipboard, ...) that are unavailable under Jest.
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 390, height: 844 })),
}));

const mockDimensions = useWindowDimensions as jest.Mock;

describe('ContentContainer', () => {
  it('renders children on phone breakpoint', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844 });

    const { getByText } = render(
      <ContentContainer>
        <Text>Content</Text>
      </ContentContainer>,
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders children on tablet breakpoint', () => {
    mockDimensions.mockReturnValue({ width: 800, height: 1024 });

    const { getByText } = render(
      <ContentContainer>
        <Text>Wide content</Text>
      </ContentContainer>,
    );
    expect(getByText('Wide content')).toBeTruthy();
  });
});
