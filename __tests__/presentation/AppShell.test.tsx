import React from 'react';
import { Text, useWindowDimensions } from 'react-native';
import { render } from '@testing-library/react-native';
import { AppShell } from '../../src/presentation/components/common/AppShell';

jest.mock('expo-font', () => ({ useFonts: () => [true], isLoaded: () => true }));
// Mock the underlying module rather than spreading the `react-native` index:
// spreading eagerly evaluates every lazy getter, which pulls in native-only
// modules (DevMenu, Clipboard, ...) that are unavailable under Jest.
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 390, height: 844 })),
}));

const mockDimensions = useWindowDimensions as jest.Mock;

describe('AppShell', () => {
  it('renders children directly on phone breakpoint', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844 });

    const { getByText } = render(
      <AppShell>
        <Text>Phone child</Text>
      </AppShell>,
    );
    expect(getByText('Phone child')).toBeTruthy();
  });

  it('wraps children in centered container on tablet breakpoint', () => {
    mockDimensions.mockReturnValue({ width: 800, height: 1024 });

    const { getByText } = render(
      <AppShell>
        <Text>Tablet child</Text>
      </AppShell>,
    );
    expect(getByText('Tablet child')).toBeTruthy();
  });
});
