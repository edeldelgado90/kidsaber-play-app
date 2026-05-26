import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'phone' | 'tablet' | 'web' | 'wide';

/**
 * Returns the current layout breakpoint based on window width.
 *
 * | Breakpoint | Min width |
 * |-----------|---------|
 * | phone | 0 |
 * | tablet | 600 |
 * | web | 1024 |
 * | wide | 1280 |
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  if (width >= 1280) return 'wide';
  if (width >= 1024) return 'web';
  if (width >= 600) return 'tablet';
  return 'phone';
}

/** Returns true on tablet or wider. */
export function useIsTabletOrWider(): boolean {
  const bp = useBreakpoint();
  return bp === 'tablet' || bp === 'web' || bp === 'wide';
}

/** Returns the appropriate horizontal padding for the current breakpoint. */
export function useHorizontalPadding(): number {
  const bp = useBreakpoint();
  if (bp === 'tablet') return 32;
  if (bp === 'web' || bp === 'wide') return 24;
  return 16;
}
