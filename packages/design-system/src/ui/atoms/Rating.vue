<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { Star } from 'lucide-vue-next'
import { colors, typography } from '../../styles/tokens.stylex'

const props = defineProps<{
  value: number
}>()

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: colors.textSecondary,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingSnug,
  },
  star: {
    display: 'flex',
    color: colors.accent,
  },
  value: {
    color: colors.textPrimary,
  },
})
</script>

<template>
  <span
    v-bind="stylex.attrs(styles.root)"
    :aria-label="`Rated ${props.value} out of 5`"
    role="text"
  >
    <Star
      :size="14"
      v-bind="stylex.attrs(styles.star)"
      aria-hidden="true"
      fill="currentColor"
    />
    <span v-bind="stylex.attrs(styles.value)">{{
      props.value.toFixed(1)
    }}</span>
  </span>
</template>
