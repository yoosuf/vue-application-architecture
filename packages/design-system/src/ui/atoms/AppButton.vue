<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import type { RouteLocationRaw } from 'vue-router'
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
    variant?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    block?: boolean
    to?: RouteLocationRaw
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    block: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.sm,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingTight,
    whiteSpace: 'nowrap',
    appearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    border: '1px solid transparent',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: `background-color ${motion.base} ${motion.easeOut}, border-color ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}, transform ${motion.fast} ${motion.easeOut}`,
    ':hover': {
      textDecoration: 'none',
    },
    ':active': {
      transform: 'translateY(1px) scale(0.99)',
    },
  },
  primary: {
    backgroundColor: colors.accent,
    color: colors.textOnAccent,
    ':hover': {
      backgroundColor: colors.accentHover,
      boxShadow: shadows.cardHover,
    },
    ':active': {
      backgroundColor: colors.accentHover,
      boxShadow: 'none',
    },
  },
  secondary: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    borderColor: colors.border,
    ':hover': {
      backgroundColor: colors.surfaceHover,
      borderColor: colors.borderStrong,
      boxShadow: shadows.cardHover,
    },
    ':active': {
      boxShadow: 'none',
    },
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
    ':hover': {
      boxShadow: 'none',
    },
    ':active': {
      transform: 'none',
      boxShadow: 'none',
    },
  },
  sizeSm: {
    padding: '6px 12px',
    fontSize: typography.sizeSm,
  },
  sizeMd: {
    padding: '10px 18px',
    fontSize: typography.sizeBase,
  },
  sizeLg: {
    padding: '12px 24px',
    fontSize: typography.sizeBase,
  },
  block: {
    width: '100%',
  },
})
</script>

<template>
  <RouterLink
    v-if="props.to"
    :to="props.to"
    :aria-disabled="props.disabled ? 'true' : 'false'"
    v-bind="
      stylex.attrs(
        styles.base,
        props.variant === 'secondary' ? styles.secondary : styles.primary,
        props.size === 'sm'
          ? styles.sizeSm
          : props.size === 'lg'
            ? styles.sizeLg
            : styles.sizeMd,
        props.disabled && styles.disabled,
        props.block && styles.block,
        focusRing.visible,
        reducedMotion.root,
      )
    "
  >
    <slot />
  </RouterLink>
  <button
    v-else
    :type="props.type"
    :disabled="props.disabled"
    v-bind="
      stylex.attrs(
        styles.base,
        props.variant === 'secondary' ? styles.secondary : styles.primary,
        props.size === 'sm'
          ? styles.sizeSm
          : props.size === 'lg'
            ? styles.sizeLg
            : styles.sizeMd,
        props.disabled && styles.disabled,
        props.block && styles.block,
        focusRing.visible,
        reducedMotion.root,
      )
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
