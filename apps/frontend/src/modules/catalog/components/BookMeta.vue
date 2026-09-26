<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import {
  colors,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

withDefaults(
  defineProps<{
    title: string
    author: string
    category: string
    year: number
  }>(),
  {},
)

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.sizeLg,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingTight,
    color: colors.textPrimary,
  },
  author: {
    fontSize: typography.sizeSm,
    lineHeight: typography.leadingSnug,
    color: colors.textSecondary,
  },
  meta: {
    marginTop: spacing.xxs,
    fontSize: typography.sizeXs,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingSnug,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <h3 v-bind="stylex.attrs(styles.title)">{{ title }}</h3>
    <p v-bind="stylex.attrs(styles.author)">{{ author }}</p>
    <p v-bind="stylex.attrs(styles.meta)">{{ category }} · {{ year }}</p>
  </div>
</template>
