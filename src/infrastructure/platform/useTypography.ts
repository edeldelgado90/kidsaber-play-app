import { useBreakpoint } from './useBreakpoint';

export interface TypographyScale {
  display: number;
  h1: number;
  h2: number;
  h3: number;
  body: number;
  bodyStrong: number;
  button: number;
  caption: number;
  badge: number;
}

/**
 * Returns scaled typography sizes for the current breakpoint.
 * Matches the scale defined in colors_and_type.css.
 */
export function useTypography(): TypographyScale {
  const bp = useBreakpoint();
  const scale = bp === 'phone' ? 1 : bp === 'tablet' ? 1.1 : 1.2;

  return {
    display: Math.round(32 * scale),
    h1: Math.round(28 * scale),
    h2: Math.round(22 * scale),
    h3: Math.round(18 * scale),
    body: Math.round(16 * scale),
    bodyStrong: Math.round(16 * scale),
    button: Math.round(16 * scale),
    caption: 12,
    badge: 11,
  };
}
