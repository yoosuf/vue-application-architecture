<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { Waypoints } from 'lucide-vue-next'
import {
  colors,
  layout,
  spacing,
  typography,
} from '../../../../../packages/design-system/src/styles/tokens.stylex'

const styles = stylex.create({
  footer: {
    width: '100%',
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlock: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
    marginTop: spacing.xxl,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    lineHeight: typography.leadingSnug,
  },
})
</script>

<template>
  <footer v-bind="stylex.attrs(styles.footer)">
    <p v-bind="stylex.attrs(styles.text)">
      <Waypoints :size="14" aria-hidden="true" />
      Shelf — a modular-monolith demo built with Vue + StyleX.
    </p>
  </footer>
</template>
