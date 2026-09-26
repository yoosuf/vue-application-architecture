<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { Minus, Plus } from 'lucide-vue-next'
import IconButton from './IconButton.vue'
import { colors, radii, spacing, typography } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    disabled?: boolean
    label?: string
  }>(),
  {
    min: 1,
    max: 99,
    disabled: false,
    label: 'Quantity',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const decreaseDisabled = computed(
  () => props.disabled || props.modelValue <= props.min,
)
const increaseDisabled = computed(
  () => props.disabled || props.modelValue >= props.max,
)

function decrease() {
  if (!decreaseDisabled.value) emit('update:modelValue', props.modelValue - 1)
}

function increase() {
  if (!increaseDisabled.value) emit('update:modelValue', props.modelValue + 1)
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xxs,
    padding: '2px',
    backgroundColor: colors.surfaceHover,
    borderRadius: radii.circle,
  },
  value: {
    minWidth: '2ch',
    textAlign: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.circle,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
})
</script>

<template>
  <div
    v-bind="stylex.attrs(styles.root)"
    role="group"
    :aria-label="props.label"
  >
    <IconButton
      :label="`Decrease ${props.label.toLowerCase()}`"
      :disabled="decreaseDisabled"
      @click="decrease"
    >
      <Minus :size="14" aria-hidden="true" />
    </IconButton>
    <span v-bind="stylex.attrs(styles.value)" aria-live="polite">
      {{ props.modelValue }}
    </span>
    <IconButton
      :label="`Increase ${props.label.toLowerCase()}`"
      :disabled="increaseDisabled"
      @click="increase"
    >
      <Plus :size="14" aria-hidden="true" />
    </IconButton>
  </div>
</template>
