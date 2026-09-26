<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import { colors, motion, radii, typography } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    label?: string
    selected?: boolean
  }>(),
  {
    label: '',
    selected: false,
  },
)

const emit = defineEmits<{
  select: []
}>()

const styles = stylex.create({
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 32,
    padding: '5px 14px',
    borderRadius: radii.circle,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingSnug,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    cursor: 'pointer',
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}, border-color ${motion.base} ${motion.easeOut}, transform ${motion.fast} ${motion.easeOut}`,
    ':hover': {
      color: colors.textPrimary,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surfaceHover,
    },
    ':active': {
      transform: 'scale(0.96)',
    },
  },
  selected: {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    ':hover': {
      color: colors.accent,
      backgroundColor: colors.accentSoft,
      borderColor: colors.accent,
    },
  },
})
</script>

<template>
  <button
    type="button"
    :aria-pressed="props.selected ? 'true' : 'false'"
    v-bind="
      stylex.attrs(
        styles.chip,
        props.selected && styles.selected,
        focusRing.visible,
        reducedMotion.root,
      )
    "
    @click="emit('select')"
  >
    <slot>{{ props.label }}</slot>
  </button>
</template>
