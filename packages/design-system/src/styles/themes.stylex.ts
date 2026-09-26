import * as stylex from '@stylexjs/stylex'
import { colors } from './tokens.stylex'

export const lightTheme = stylex.createTheme(colors, {
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

export const darkTheme = stylex.createTheme(colors, {
  background: '#11120f',
  surface: '#1b1c18',
  surfaceHover: '#232420',
  textPrimary: '#f4f4ef',
  textSecondary: '#aaa9a2',
  textOnAccent: '#11120f',
  accent: '#9db69a',
  accentHover: '#b0c6ad',
  accentSoft: '#2b3027',
  border: '#2c2d28',
  borderStrong: '#45463e',
  favorite: '#e0766a',
  favoriteSoft: '#3a2723',
  danger: '#e07a6a',
  dangerSoft: '#3b2622',
  shadow: 'rgba(0, 0, 0, 0.45)',
  overlay: 'rgba(0, 0, 0, 0.6)',
})
