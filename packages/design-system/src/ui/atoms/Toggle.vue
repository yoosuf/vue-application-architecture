<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  shadows,
  spacing,
  typography,
} from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    label: string
    checked?: boolean
    disabled?: boolean
  }>(),
  {
    checked: false,
    disabled: false,
  },
)

defineEmits<{
  'update:checked': [checked: boolean]
}>()

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 0,
    border: 'none',
    background: 'none',
    font: 'inherit',
    fontSize: typography.sizeBase,
    color: colors.textPrimary,
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  track: {
    position: 'relative',
    width: 44,
    height: 24,
    borderRadius: radii.circle,
    backgroundColor: colors.borderStrong,
    flexShrink: 0,
    transition: `background-color ${motion.base} ${motion.easeOut}`,
  },
  trackOn: {
    backgroundColor: colors.accent,
  },
  knob: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 18,
    height: 18,
    borderRadius: radii.circle,
    backgroundColor: colors.surface,
    boxShadow: shadows.card,
    transition: `transform ${motion.base} ${motion.easeOut}`,
  },
  knobOn: {
    transform: 'translateX(20px)',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="props.checked ? 'true' : 'false'"
    :aria-label="props.label"
    :disabled="props.disabled"
    v-bind="
      stylex.attrs(
        styles.root,
        props.disabled && styles.disabled,
        focusRing.visible,
        focusRing.halo,
        reducedMotion.root,
      )
    "
    @click="props.disabled || $emit('update:checked', !props.checked)"
  >
    <span
      aria-hidden="true"
      v-bind="stylex.attrs(styles.track, props.checked && styles.trackOn)"
    >
      <span
        v-bind="stylex.attrs(styles.knob, props.checked && styles.knobOn)"
      />
    </span>
    <span>{{ props.label }}</span>
  </button>
</template>
