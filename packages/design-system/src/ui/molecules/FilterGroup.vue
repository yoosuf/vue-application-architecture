<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { spacing } from '../../styles/tokens.stylex'

withDefaults(
  defineProps<{
    label: string
  }>(),
  {},
)

const styles = stylex.create({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)" role="group" :aria-label="label">
    <slot />
  </div>
</template>
