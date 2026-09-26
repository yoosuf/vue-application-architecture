<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { useId } from 'vue'
import { reducedMotion } from '../../styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  spacing,
  typography,
} from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'number'
    placeholder?: string
    hint?: string
    error?: string
    autocomplete?: string
    inputmode?: 'none' | 'text' | 'tel' | 'email' | 'numeric'
    required?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = useId()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xxs,
  },
  label: {
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  input: {
    width: '100%',
    paddingBlock: '10px',
    paddingInline: spacing.sm,
    fontSize: typography.sizeBase,
    fontFamily: typography.fontSans,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    appearance: 'none',
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    transition: `border-color ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}`,
    '::placeholder': {
      color: colors.textSecondary,
      opacity: 1,
    },
    ':hover': {
      borderColor: colors.borderStrong,
    },
    ':focus-visible': {
      outline: 'none',
      borderColor: colors.accent,
      boxShadow: `0 0 0 3px ${colors.accentSoft}`,
    },
  },
  inputInvalid: {
    borderColor: colors.danger,
    ':focus-visible': {
      borderColor: colors.danger,
      boxShadow: `0 0 0 3px ${colors.dangerSoft}`,
    },
  },
  inputDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  hint: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  error: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.danger,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <label :for="inputId" v-bind="stylex.attrs(styles.label)">
      {{ props.label }}<span v-if="props.required" aria-hidden="true"> *</span>
    </label>
    <input
      :id="inputId"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      :inputmode="props.inputmode"
      :required="props.required"
      :disabled="props.disabled"
      :aria-invalid="props.error ? 'true' : undefined"
      :aria-describedby="
        props.error || props.hint ? `${inputId}-support` : undefined
      "
      v-bind="stylex.attrs(styles.input, props.error ? styles.inputInvalid : false, props.disabled && styles.inputDisabled, reducedMotion.root)"
      @input="onInput"
    />
    <p
      v-if="props.error"
      :id="`${inputId}-support`"
      v-bind="stylex.attrs(styles.error)"
      role="alert"
    >
      {{ props.error }}
    </p>
    <p v-else-if="props.hint" :id="`${inputId}-support`">
      <span v-bind="stylex.attrs(styles.hint)">{{ props.hint }}</span>
    </p>
  </div>
</template>