import { renderHook } from '@testing-library/react-native';
import { useWindowDimensions } from 'react-native';
import {
  useBreakpoint,
  useIsTabletOrWider,
  useHorizontalPadding,
  useContentWidth,
  APP_MAX_WIDTH,
} from '../../src/infrastructure/platform/useBreakpoint';

// Mock the underlying module rather than spreading the `react-native` index:
// spreading eagerly evaluates every lazy getter, which pulls in native-only
// modules (DevMenu, Clipboard, ...) that are unavailable under Jest.
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockDimensions = useWindowDimensions as jest.Mock;

describe('useBreakpoint', () => {
  it('returns phone for width 320', () => {
    mockDimensions.mockReturnValue({ width: 320, height: 800 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('phone');
  });

  it('returns tablet for width 600', () => {
    mockDimensions.mockReturnValue({ width: 600, height: 800 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('tablet');
  });

  it('returns web for width 1024', () => {
    mockDimensions.mockReturnValue({ width: 1024, height: 800 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('web');
  });

  it('returns wide for width 1280', () => {
    mockDimensions.mockReturnValue({ width: 1280, height: 800 });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('wide');
  });
});

describe('useIsTabletOrWider', () => {
  it('returns false for phone', () => {
    mockDimensions.mockReturnValue({ width: 375, height: 800 });
    const { result } = renderHook(() => useIsTabletOrWider());
    expect(result.current).toBe(false);
  });

  it('returns true for tablet', () => {
    mockDimensions.mockReturnValue({ width: 768, height: 1024 });
    const { result } = renderHook(() => useIsTabletOrWider());
    expect(result.current).toBe(true);
  });

  it('returns true for wide', () => {
    mockDimensions.mockReturnValue({ width: 1440, height: 900 });
    const { result } = renderHook(() => useIsTabletOrWider());
    expect(result.current).toBe(true);
  });
});

describe('useHorizontalPadding', () => {
  it('returns 16 for phone', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844 });
    const { result } = renderHook(() => useHorizontalPadding());
    expect(result.current).toBe(16);
  });

  it('returns 24 for tablet', () => {
    mockDimensions.mockReturnValue({ width: 768, height: 1024 });
    const { result } = renderHook(() => useHorizontalPadding());
    expect(result.current).toBe(24);
  });

  it('returns 24 for web', () => {
    mockDimensions.mockReturnValue({ width: 1280, height: 900 });
    const { result } = renderHook(() => useHorizontalPadding());
    expect(result.current).toBe(24);
  });
});

describe('useContentWidth', () => {
  it('returns actual width for phone', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844 });
    const { result } = renderHook(() => useContentWidth());
    expect(result.current).toBe(390);
  });

  it('returns APP_MAX_WIDTH when tablet width exceeds it', () => {
    mockDimensions.mockReturnValue({ width: 768, height: 1024 });
    const { result } = renderHook(() => useContentWidth());
    expect(result.current).toBe(APP_MAX_WIDTH);
  });
});
