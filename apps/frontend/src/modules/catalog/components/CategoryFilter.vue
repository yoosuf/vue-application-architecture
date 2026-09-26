<script setup lang="ts">
import FilterGroup from '@vue-application-architecture/design-system/ui/molecules/FilterGroup.vue'
import Chip from '@vue-application-architecture/design-system/ui/atoms/Chip.vue'
import type { CategoryFilter } from '../stores/catalog.store'

defineProps<{
  modelValue: CategoryFilter
  categories: CategoryFilter[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CategoryFilter]
}>()
</script>

<template>
  <FilterGroup label="Filter books by category">
    <Chip
      v-for="category in categories"
      :key="category"
      :label="category"
      :selected="modelValue === category"
      @select="emit('update:modelValue', category)"
    />
  </FilterGroup>
</template>
