import { renderHook } from '@testing-library/react-native';
import { useWindowDimensions } from 'react-native';
import { useTypography } from '../../src/infrastructure/platform/useTypography';

// Mock the underlying module rather than spreading the `react-native` index:
// spreading eagerly evaluates every lazy getter, which pulls in native-only
// modules (DevMenu, Clipboard, ...) that are unavailable under Jest.
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockDimensions = useWindowDimensions as jest.Mock;

describe('useTypography', () => {
  it('returns base sizes for phone (scale 1)', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844 });
    const { result } = renderHook(() => useTypography());

    expect(result.current.display).toBe(32);
    expect(result.current.h1).toBe(28);
    expect(result.current.caption).toBe(12);
    expect(result.current.badge).toBe(11);
  });

  it('returns scaled sizes for tablet (scale 1.1)', () => {
    mockDimensions.mockReturnValue({ width: 768, height: 1024 });
    const { result } = renderHook(() => useTypography());

    expect(result.current.display).toBe(Math.round(32 * 1.1));
    expect(result.current.h1).toBe(Math.round(28 * 1.1));
  });

  it('returns scaled sizes for web/wide (scale 1.2)', () => {
    mockDimensions.mockReturnValue({ width: 1280, height: 900 });
    const { result } = renderHook(() => useTypography());

    expect(result.current.display).toBe(Math.round(32 * 1.2));
    expect(result.current.h2).toBe(Math.round(22 * 1.2));
  });

  it('caption and badge sizes remain fixed at 12 and 11', () => {
    mockDimensions.mockReturnValue({ width: 1440, height: 900 });
    const { result } = renderHook(() => useTypography());

    expect(result.current.caption).toBe(12);
    expect(result.current.badge).toBe(11);
  });
});
