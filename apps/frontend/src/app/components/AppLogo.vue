<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { BookOpen } from 'lucide-vue-next'
import {
  colors,
  spacing,
  typography,
} from '../../../../../packages/design-system/src/styles/tokens.stylex'

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    display: 'flex',
    color: colors.accent,
  },
  wordmark: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.sizeXl,
    fontWeight: typography.weightBold,
    letterSpacing: '-0.02em',
    lineHeight: typography.leadingTight,
  },
})
</script>

<template>
  <span v-bind="stylex.attrs(styles.root)">
    <BookOpen
      :size="20"
      v-bind="stylex.attrs(styles.icon)"
      aria-hidden="true"
    />
    <span v-bind="stylex.attrs(styles.wordmark)">Shelf</span>
  </span>
</template>
