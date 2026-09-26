<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, typography } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    level?: 'h1' | 'h2' | 'h3'
    size?: '2xl' | '3xl'
    id?: string
    marginBlockEnd?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    level: 'h2',
    size: '3xl',
    id: undefined,
    marginBlockEnd: 'none',
  },
)

const sizeStyle = computed(() =>
  props.size === '2xl' ? styles.size2xl : styles.size3xl,
)

const styles = stylex.create({
  base: {
    fontFamily: typography.fontDisplay,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingTight,
    color: colors.textPrimary,
    margin: 0,
  },
  size2xl: {
    fontSize: typography.size2xl,
    '@media (max-width: 640px)': {
      fontSize: typography.sizeXl,
    },
  },
  size3xl: {
    fontSize: typography.size3xl,
    letterSpacing: '-0.02em',
    '@media (max-width: 640px)': {
      fontSize: typography.size2xl,
    },
  },
  marginSm: {
    marginBlockEnd: spacing.sm,
  },
  marginMd: {
    marginBlockEnd: spacing.md,
  },
  marginLg: {
    marginBlockEnd: spacing.lg,
  },
})

function marginStyleFor(
  value: 'none' | 'sm' | 'md' | 'lg',
): typeof styles.marginSm | undefined {
  if (value === 'sm') return styles.marginSm
  if (value === 'md') return styles.marginMd
  if (value === 'lg') return styles.marginLg
  return undefined
}
</script>

<template>
  <component
    :is="props.level"
    :id="props.id"
    v-bind="
      stylex.attrs(styles.base, sizeStyle, marginStyleFor(props.marginBlockEnd))
    "
  >
    <slot />
  </component>
</template>
