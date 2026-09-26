<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { spacing } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    gap?: 'md' | 'lg'
    minColumns?: 1 | 2
  }>(),
  {
    gap: 'lg',
    minColumns: 1,
  },
)

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(5, minmax(0, 1fr))',
      '@media (max-width: 1200px)': 'repeat(4, minmax(0, 1fr))',
      '@media (max-width: 900px)': 'repeat(3, minmax(0, 1fr))',
      '@media (max-width: 600px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  collapse: {
    '@media (max-width: 480px)': {
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    },
  },
  gapLg: {
    gap: {
      default: spacing.lg,
      '@media (max-width: 600px)': spacing.md,
    },
  },
  gapMd: {
    gap: spacing.md,
  },
})
</script>

<template>
  <div
    v-bind="
      stylex.attrs(
        styles.grid,
        props.minColumns === 1 && styles.collapse,
        props.gap === 'md' ? styles.gapMd : styles.gapLg,
      )
    "
  >
    <slot />
  </div>
</template>
