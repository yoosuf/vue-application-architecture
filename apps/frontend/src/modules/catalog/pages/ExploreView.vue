<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FeaturedBook from '../components/FeaturedBook.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import SortControl from '../components/SortControl.vue'
import { ALL_CATEGORIES, useCatalogStore } from '../stores/catalog.store'
import type { CategoryFilter as CategoryFilterValue } from '../stores/catalog.store'
import { BookGrid } from '..'
import { AddToCartButton } from '../../cart'
import { FavoriteButton } from '../../favorites'
import {
  EmptyState,
  SearchBar,
} from '@vue-application-architecture/design-system'
import Breadcrumbs from '@vue-application-architecture/design-system/ui/molecules/Breadcrumbs.vue'
import PageSection from '@vue-application-architecture/design-system/ui/molecules/PageSection.vue'
import SectionHeading from '@vue-application-architecture/design-system/ui/atoms/SectionHeading.vue'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import {
  colors,
  layout,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const catalog = useCatalogStore()
const route = useRoute()
const router = useRouter()

const category = computed<CategoryFilterValue>({
  get: () => catalog.selectedCategory,
  set: (value) => {
    catalog.setCategory(value)
    void (
      value === ALL_CATEGORIES
        ? router.push({ name: 'explore' })
        : router.push({
            name: 'collection',
            params: { category: value.toLowerCase() },
          })
    ).catch(() => {})
  },
})

const categorySlug = computed(() => {
  const slug = route.params.category
  return typeof slug === 'string' ? slug.toLowerCase() : ''
})

const currentCategoryLabel = computed(() => {
  const match = catalog.categories.find(
    (category) => category.toLowerCase() === categorySlug.value,
  )
  return match ?? ''
})

watch(
  categorySlug,
  (slug) => {
    const match = catalog.categories.find(
      (category) => category.toLowerCase() === slug,
    )
    catalog.setCategory(match ?? ALL_CATEGORIES)
  },
  { immediate: true },
)
const search = computed({
  get: () => catalog.searchQuery,
  set: (value: string) => catalog.setSearchQuery(value),
})

const sortOrder = computed({
  get: () => catalog.sortOrder,
  set: (value) => catalog.setSortOrder(value),
})

function clearFilters() {
  catalog.setSearchQuery('')
  catalog.setCategory(ALL_CATEGORIES)
}

const styles = stylex.create({
  breadcrumbs: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlockStart: spacing.sm,
  },
  headingRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  resultCount: {
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
})
</script>

<template>
  <div>
    <div v-if="currentCategoryLabel" v-bind="stylex.attrs(styles.breadcrumbs)">
      <Breadcrumbs
        :items="[{ label: 'Home', to: '/' }, { label: currentCategoryLabel }]"
      />
    </div>

    <FeaturedBook />

    <PageSection layout="column" label="Explore books">
      <div v-bind="stylex.attrs(styles.headingRow)">
        <SectionHeading level="h2">Explore Books</SectionHeading>
      </div>

      <SearchBar
        :model-value="search"
        placeholder="Search books"
        @update:model-value="search = $event"
      />

      <CategoryFilter v-model="category" :categories="catalog.categories" />

      <div v-bind="stylex.attrs(styles.filterBar)">
        <SortControl v-model="sortOrder" />
        <p v-bind="stylex.attrs(styles.resultCount)" role="status">
          {{ catalog.filteredBooks.length }}
          {{ catalog.filteredBooks.length === 1 ? 'book' : 'books' }}
        </p>
      </div>

      <BookGrid
        v-if="catalog.sortedBooks.length > 0"
        :books="catalog.sortedBooks"
      >
        <template #footer="{ book }">
          <AddToCartButton :book="book" size="sm" block />
          <FavoriteButton :book="book" />
        </template>
      </BookGrid>

      <EmptyState
        v-else
        title="No books found"
        message="Try a different search term or category."
      >
        <AppButton variant="secondary" @click="clearFilters">
          Clear search & filters
        </AppButton>
      </EmptyState>
    </PageSection>
  </div>
</template>
