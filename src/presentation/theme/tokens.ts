/**
 * Design tokens for KidSaber Play.
 * Source of truth: 2.Design/design_handoff_kidsaber_play/colors_and_type.css
 *
 * All values mirror the CSS custom properties exactly.
 */

export const Colors = {
  // Brand
  brandPrimary: '#0071da',
  brandPrimaryDark: '#0058b0',
  brandPrimaryLight: '#4d9ef5',
  brandSecondary: '#f5c400',
  brandSecondaryDark: '#c49a00',

  // Surfaces & Neutrals (light)
  surface: '#ffffff',
  surfaceMuted: '#f4f7fb',
  surfaceHighlight: '#e8f0fe',
  background: '#f0f4f8',
  borderSubtle: '#e2e8f0',
  borderActive: '#0071da',

  // Text (light)
  textPrimary: '#1a1a2e',
  textSecondary: '#4a4a6a',
  textDisabled: '#9090a8',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#1a1a2e',

  // Semantic
  success: '#22c55e',
  successSurface: '#dcfce7',
  error: '#ef4444',
  errorSurface: '#fee2e2',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Subject accents
  subjectLanguage: '#ef4444',
  subjectMathematics: '#0071da',
  subjectScience: '#22c55e',
  subjectEnglish: '#8b5cf6',

  // Dark theme overrides
  dark: {
    brandPrimary: '#4d9ef5',
    surface: '#1e1e2e',
    surfaceMuted: '#2a2a3e',
    surfaceHighlight: '#2d3a5c',
    background: '#12121f',
    borderSubtle: '#3a3a50',
    borderActive: '#4d9ef5',
    textPrimary: '#f0f0f8',
    textSecondary: '#a0a0c0',
    textDisabled: '#5a5a70',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const Elevation = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const Typography = {
  // Font family
  fontFamily: 'Nunito',
  // Font weights
  weights: {
    regular: '400' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  // Type scale (mobile — phone breakpoint)
  scale: {
    display: { size: 32, weight: '800' as const, lineHeight: 40, letterSpacing: -0.32 },
    h1: { size: 28, weight: '700' as const, lineHeight: 36, letterSpacing: -0.28 },
    h2: { size: 22, weight: '700' as const, lineHeight: 30 },
    h3: { size: 18, weight: '600' as const, lineHeight: 26 },
    body: { size: 16, weight: '400' as const, lineHeight: 24 },
    bodyStrong: { size: 16, weight: '600' as const, lineHeight: 24 },
    button: { size: 16, weight: '700' as const, lineHeight: 20 },
    caption: { size: 12, weight: '400' as const, lineHeight: 18 },
    badge: { size: 11, weight: '700' as const, lineHeight: 16, letterSpacing: 0.44 },
  },
} as const;

export const Motion = {
  durationFast: 150,
  durationNormal: 250,
  durationSlow: 400,
  durationStar: 600,
} as const;

export const TouchTarget = {
  min: 44,
} as const;
