<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import { colors, motion, spacing, typography } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    tone?: 'accent' | 'danger'
  }>(),
  {
    type: 'button',
    disabled: false,
    tone: 'accent',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    appearance: 'none',
    padding: 0,
    background: 'none',
    border: 'none',
    fontFamily: typography.fontSans,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingTight,
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationThickness: '1px',
    textUnderlineOffset: '3px',
    WebkitTapHighlightColor: 'transparent',
    transition: `color ${motion.base} ${motion.easeOut}`,
  },
  accent: {
    color: colors.accent,
    textDecorationColor: colors.accent,
    ':hover': {
      color: colors.accentHover,
    },
  },
  danger: {
    color: colors.danger,
    textDecorationColor: colors.danger,
    ':hover': {
      color: colors.danger,
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
    :disabled="props.disabled"
    v-bind="
      stylex.attrs(
        styles.base,
        props.tone === 'danger' ? styles.danger : styles.accent,
        props.disabled && styles.disabled,
        focusRing.visible,
        reducedMotion.root,
      )
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
