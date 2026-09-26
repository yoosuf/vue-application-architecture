<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
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
  select: {
    appearance: 'none',
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
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    ':hover': {
      borderColor: colors.borderStrong,
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  flex: {
    flex: '1 1 auto',
    minWidth: 0,
  },
})
</script>

<template>
  <select
    :value="props.modelValue"
    :aria-label="props.ariaLabel"
    :disabled="props.disabled"
    v-bind="
      stylex.attrs(
        styles.select,
        props.flex && styles.flex,
        focusRing.visible,
        reducedMotion.root,
      )
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
</template>
