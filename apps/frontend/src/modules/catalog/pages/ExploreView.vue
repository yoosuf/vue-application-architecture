<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { computed } from 'vue'
import FeaturedBook from '../components/FeaturedBook.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import { useCatalogStore } from '../stores/catalog.store'
import { ALL_CATEGORIES } from '../stores/catalog.store'
import { BookGrid } from '..'
import SearchBar from '@vue-application-architecture/design-system/ui/molecules/SearchBar.vue'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import { FavoriteButton } from '../../favorites'
import { AddToCartButton } from '../../cart'
import {
  colors,
  layout,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const catalog = useCatalogStore()

const search = computed({
  get: () => catalog.searchQuery,
  set: (value: string) => catalog.setSearchQuery(value),
})

function clearFilters() {
  catalog.setSearchQuery('')
  catalog.setCategory(ALL_CATEGORIES)
}

const styles = stylex.create({
  section: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlock: spacing.xxl,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  headingRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  heading: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size3xl,
    fontWeight: typography.weightBold,
    letterSpacing: '-0.02em',
    lineHeight: typography.leadingTight,
    color: colors.textPrimary,
  },
  resultCount: {
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
})
</script>

<template>
  <div>
    <FeaturedBook />

    <section v-bind="stylex.attrs(styles.section)" aria-label="Explore books">
      <div v-bind="stylex.attrs(styles.headingRow)">
        <h2 v-bind="stylex.attrs(styles.heading)">Explore Books</h2>
        <p v-bind="stylex.attrs(styles.resultCount)" role="status">
          {{ catalog.filteredBooks.length }}
          {{ catalog.filteredBooks.length === 1 ? 'book' : 'books' }}
        </p>
      </div>

      <SearchBar
        :model-value="search"
        placeholder="Search books"
        @update:model-value="search = $event"
      />

      <CategoryFilter />

      <BookGrid
        v-if="catalog.filteredBooks.length > 0"
        :books="catalog.filteredBooks"
      >
        <template #footer="{ book }">
          <FavoriteButton :book="book" />
          <AddToCartButton :book="book" />
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
    </section>
  </div>
</template>
