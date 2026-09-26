<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import CategoryChip from './CategoryChip.vue'
import { useCatalogStore } from '../stores/catalog.store'
import { spacing } from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const catalog = useCatalogStore()

const styles = stylex.create({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
})
</script>

<template>
  <div
    v-bind="stylex.attrs(styles.root)"
    role="group"
    aria-label="Filter books by category"
  >
    <CategoryChip
      v-for="category in catalog.categories"
      :key="category"
      :label="category"
      :selected="catalog.selectedCategory === category"
      @select="catalog.setCategory(category)"
    />
  </div>
</template>
