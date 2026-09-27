<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { ChevronDown } from 'lucide-vue-next'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import { colors, radii, typography } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: readonly { value: string; label: string }[]
    ariaLabel?: string
    disabled?: boolean
    flex?: boolean
  }>(),
  {
    ariaLabel: undefined,
    disabled: false,
    flex: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  },
  select: {
    appearance: 'none',
    width: '100%',
    padding: '8px 32px 8px 12px',
    borderRadius: radii.sm,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontFamily: typography.fontSans,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingTight,
    cursor: 'pointer',
    ':hover': {
      borderColor: colors.borderStrong,
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  chevron: {
    position: 'absolute',
    right: 10,
    display: 'flex',
    pointerEvents: 'none',
    color: colors.textSecondary,
  },
  flex: {
    flex: '1 1 auto',
    minWidth: 0,
  },
})
</script>

<template>
  <span v-bind="stylex.attrs(styles.root, props.flex && styles.flex)">
    <select
      :value="props.modelValue"
      :aria-label="props.ariaLabel"
      :disabled="props.disabled"
      v-bind="
        stylex.attrs(styles.select, focusRing.visible, reducedMotion.root)
      "
      @change="
        emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
    >
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <ChevronDown
      :size="12"
      v-bind="stylex.attrs(styles.chevron)"
      aria-hidden="true"
    />
  </span>
</template>
