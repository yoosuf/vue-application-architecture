<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { BookGrid } from '../../catalog'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import { useFavoritesStore } from '../stores/favorites.store'
import {
  colors,
  layout,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const favorites = useFavoritesStore()

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
  <section v-bind="stylex.attrs(styles.section)" aria-label="Your favorites">
    <template v-if="favorites.favoriteBooks.length > 0">
      <div v-bind="stylex.attrs(styles.headingRow)">
        <h1 v-bind="stylex.attrs(styles.heading)">Your Favorites</h1>
        <p v-bind="stylex.attrs(styles.resultCount)" role="status">
          {{ favorites.count }}
          {{ favorites.count === 1 ? 'book saved' : 'books saved' }}
        </p>
      </div>

      <BookGrid :books="favorites.favoriteBooks">
        <template #footer="{ book }">
          <FavoriteButton :book="book" />
        </template>
      </BookGrid>
    </template>

    <EmptyState
      v-else
      heading-level="h1"
      title="Your shelf is empty."
      message="Explore books and save the ones you want to revisit."
    >
      <AppButton :to="{ name: 'explore' }">Explore Books</AppButton>
    </EmptyState>
  </section>
</template>
