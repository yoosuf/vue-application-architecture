<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { LoaderCircle } from 'lucide-vue-next'
import { reducedMotion, visuallyHidden } from '../../styles/shared.stylex'
import { colors } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    size?: number
    label?: string
  }>(),
  {
    size: 24,
    label: 'Loading',
  },
)

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

const styles = stylex.create({
  root: {
    display: 'inline-flex',
  },
  spinner: {
    color: colors.accent,
    animationName: spin,
    animationDuration: '0.9s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
})
</script>

<template>
  <span role="status" v-bind="stylex.attrs(styles.root)">
    <LoaderCircle
      :size="props.size"
      aria-hidden="true"
      v-bind="stylex.attrs(styles.spinner, reducedMotion.root)"
    />
    <span v-bind="stylex.attrs(visuallyHidden.root)">{{ props.label }}</span>
  </span>
</template>
