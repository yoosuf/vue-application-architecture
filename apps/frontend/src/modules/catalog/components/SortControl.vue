<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { ArrowDownUp } from 'lucide-vue-next'
import NativeSelect from '@vue-application-architecture/design-system/ui/atoms/NativeSelect.vue'
import {
  colors,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import type { SortOrder } from '../stores/catalog.store'

defineProps<{
  modelValue: SortOrder
}>()

defineEmits<{
  'update:modelValue': [value: SortOrder]
}>()

const options: Array<{ value: SortOrder; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'title', label: 'Title A–Z' },
]

const styles = stylex.create({
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.sm,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
    '@media (max-width: 560px)': {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
  icon: {
    display: 'flex',
  },
})
</script>

<template>
  <label v-bind="stylex.attrs(styles.label)">
    <span v-bind="stylex.attrs(styles.icon)">
      <ArrowDownUp :size="14" aria-hidden="true" />
    </span>
    Sort by
    <NativeSelect
      :model-value="modelValue"
      :options="options"
      flex
      @update:model-value="$emit('update:modelValue', $event as SortOrder)"
    />
  </label>
</template>
