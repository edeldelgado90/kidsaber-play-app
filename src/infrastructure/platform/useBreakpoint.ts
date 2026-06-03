import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'phone' | 'tablet' | 'web' | 'wide';

/**
 * Maximum content width for the app shell on non-phone breakpoints.
 * Matches the AppShell constraint in app/_layout.tsx.
 */
export const APP_MAX_WIDTH = 480;

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
  if (bp === 'tablet') return 24;
  if (bp === 'web' || bp === 'wide') return 24;
  return 16;
}

/**
 * Returns the effective content width, accounting for the AppShell cap.
 * On phone: actual window width. On tablet/web/wide: capped at APP_MAX_WIDTH.
 */
export function useContentWidth(): number {
  const { width } = useWindowDimensions();
  const bp = useBreakpoint();
  return bp === 'phone' ? width : Math.min(width, APP_MAX_WIDTH);
}
