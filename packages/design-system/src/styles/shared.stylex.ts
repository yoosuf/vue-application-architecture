import * as stylex from '@stylexjs/stylex'
import { colors } from './tokens.stylex'

export const visuallyHidden = stylex.create({
  root: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
})

export const buttonReset = stylex.create({
  root: {
    appearance: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    font: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
  },
})

export const linkReset = stylex.create({
  root: {
    textDecoration: 'none',
    color: 'inherit',
  },
})

export const focusRing = stylex.create({
  visible: {
    ':focus-visible': {
      outlineColor: colors.accent,
      outlineStyle: 'solid',
      outlineWidth: 2,
      outlineOffset: 3,
    },
  },
  halo: {
    ':focus-visible': {
      boxShadow: `0 0 0 4px ${colors.accentSoft}`,
    },
  },
})

export const reducedMotion = stylex.create({
  root: {
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      transform: 'none',
      animation: 'none',
    },
  },
})
