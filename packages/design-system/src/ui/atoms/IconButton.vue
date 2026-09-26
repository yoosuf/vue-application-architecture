<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import { colors, motion, radii, shadows } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit'
    pressed?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    pressed: false,
    disabled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: radii.circle,
    color: colors.textSecondary,
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    cursor: 'pointer',
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}, transform ${motion.fast} ${motion.easeOut}`,
    ':hover': {
      color: colors.textPrimary,
      backgroundColor: colors.surfaceHover,
      boxShadow: shadows.card,
    },
    ':active': {
      boxShadow: 'none',
      transform: 'scale(0.92)',
    },
  },
  pressed: {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    ':hover': {
      boxShadow: shadows.card,
    },
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})
</script>

<template>
  <button
    :type="props.type"
    :aria-label="props.label"
    :aria-pressed="props.pressed ? 'true' : 'false'"
    :disabled="props.disabled"
    v-bind="
      stylex.attrs(
        styles.root,
        props.pressed && styles.pressed,
        props.disabled && styles.disabled,
        focusRing.visible,
        focusRing.halo,
        reducedMotion.root,
      )
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
