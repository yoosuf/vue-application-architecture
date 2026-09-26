import * as stylex from '@stylexjs/stylex'

export const colors = stylex.defineVars({
  background: '#f7f6f2',
  surface: '#ffffff',
  surfaceHover: '#f5f4ef',
  textPrimary: '#191917',
  textSecondary: '#696964',
  textOnAccent: '#ffffff',
  accent: '#465b45',
  accentHover: '#3b4c3a',
  accentSoft: '#eceae2',
  border: '#e1dfd7',
  borderStrong: '#c9c6bb',
  favorite: '#b7472f',
  favoriteSoft: '#f6e5e0',
  danger: '#a93226',
  dangerSoft: '#f7e4e0',
  shadow: 'rgba(25, 25, 23, 0.12)',
  overlay: 'rgba(25, 25, 23, 0.55)',
})

export const spacing = stylex.defineVars({
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
})

export const typography = stylex.defineVars({
  fontSans:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  fontDisplay:
    "Charter, Georgia, 'Bitstream Charter', 'Iowan Old Style', 'Times New Roman', serif",
  sizeXs: '12px',
  sizeSm: '14px',
  sizeBase: '16px',
  sizeLg: '18px',
  sizeXl: '22px',
  size2xl: '28px',
  size3xl: '38px',
  size4xl: '52px',
  leadingTight: '1.15',
  leadingSnug: '1.35',
  leadingNormal: '1.6',
  weightRegular: '400',
  weightMedium: '500',
  weightBold: '700',
})

export const radii = stylex.defineVars({
  sm: '6px',
  md: '10px',
  lg: '16px',
  circle: '999px',
})

export const shadows = stylex.defineVars({
  card: '0 1px 2px rgba(25, 25, 23, 0.06), 0 1px 3px rgba(25, 25, 23, 0.08)',
  cardHover:
    '0 4px 10px rgba(25, 25, 23, 0.1), 0 10px 24px rgba(25, 25, 23, 0.12)',
})

export const motion = stylex.defineVars({
  fast: '120ms',
  base: '180ms',
  slow: '260ms',
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
})

export const layout = stylex.defineVars({
  headerHeight: '68px',
  pageMaxWidth: '1200px',
  pageGutter: 'clamp(16px, 4vw, 40px)',
})
