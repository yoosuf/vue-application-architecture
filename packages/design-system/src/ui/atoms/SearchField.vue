<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { Search, X } from 'lucide-vue-next'
import { useId } from 'vue'
import {
  focusRing,
  reducedMotion,
  visuallyHidden,
} from '../../styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  shadows,
  spacing,
  typography,
} from '../../styles/tokens.stylex'

const inputId = useId()

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    ariaLabel?: string
  }>(),
  {
    placeholder: 'Search…',
    ariaLabel: 'Search',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function clear() {
  emit('update:modelValue', '')
}

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: spacing.sm,
    display: 'flex',
    color: colors.textSecondary,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    paddingBlock: '11px',
    paddingInline: `${spacing.xl} 44px`,
    fontSize: typography.sizeBase,
    fontFamily: typography.fontSans,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    appearance: 'none',
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    cursor: 'text',
    transition: `border-color ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}`,
    '::-webkit-search-cancel-button': {
      WebkitAppearance: 'none',
      appearance: 'none',
    },
    '::-webkit-search-decoration': {
      WebkitAppearance: 'none',
      appearance: 'none',
    },
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
  clear: {
    position: 'absolute',
    right: spacing.xs,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    color: colors.textSecondary,
    cursor: 'pointer',
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}, transform ${motion.fast} ${motion.easeOut}`,
    ':hover': {
      color: colors.textPrimary,
      backgroundColor: colors.surfaceHover,
      boxShadow: shadows.card,
    },
    ':active': {
      boxShadow: 'none',
      transform: 'scale(0.9)',
    },
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <label v-bind="stylex.attrs(visuallyHidden.root)" :for="inputId">
      {{ props.ariaLabel }}
    </label>
    <Search :size="16" v-bind="stylex.attrs(styles.icon)" aria-hidden="true" />
    <input
      :id="inputId"
      v-bind="stylex.attrs(styles.input, reducedMotion.root)"
      type="search"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :aria-label="props.ariaLabel"
      autocomplete="off"
      @input="onInput"
    />
    <button
      v-if="props.modelValue.length > 0"
      v-bind="
        stylex.attrs(
          styles.clear,
          focusRing.visible,
          focusRing.halo,
          reducedMotion.root,
        )
      "
      type="button"
      aria-label="Clear search"
      @click="clear"
    >
      <X :size="14" aria-hidden="true" />
    </button>
  </div>
</template>
