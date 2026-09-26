<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import * as stylex from '@stylexjs/stylex'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import Rating from '@vue-application-architecture/design-system/ui/atoms/Rating.vue'
import SearchField from '@vue-application-architecture/design-system/ui/atoms/SearchField.vue'
import ThemeToggle from '@vue-application-architecture/design-system/ui/atoms/ThemeToggle.vue'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import { FavoriteButton } from '@/modules/favorites'
import { useCatalogStore } from '@/modules/catalog'
import { useFavoritesStore } from '@/modules/favorites'
import { usePreferencesStore } from '@/modules/core'
import { darkTheme, lightTheme } from '../../../packages/design-system/src/styles/themes.stylex'
import { colors, radii, spacing, typography } from '../../../packages/design-system/src/styles/tokens.stylex'
import type { Book } from '@vue-application-architecture/types/book'

const catalog = useCatalogStore()
const favorites = useFavoritesStore()
const preferences = usePreferencesStore()

const themeClass = computed(() =>
  preferences.theme === 'dark' ? darkTheme : lightTheme,
)

const searchQuery = computed({
  get: () => catalog.searchQuery,
  set: (value: string) => catalog.setSearchQuery(value),
})

const snapshot = computed(() =>
  JSON.stringify(
    {
      theme: preferences.theme,
      searchQuery: catalog.searchQuery,
      selectedCategory: catalog.selectedCategory,
      filteredBooks: catalog.filteredBooks.length,
      totalBooks: catalog.books.length,
      favoriteIds: [...favorites.favoriteIds],
      favoritesCount: favorites.count,
    },
    null,
    2,
  ),
)

function clearFavorites() {
  for (const id of [...favorites.favoriteIds]) {
    favorites.removeFavorite(id)
  }
}

watchEffect(() => {
  document.documentElement.dataset.dsTheme = preferences.theme
})

const featured = computed(() => catalog.featuredBook)
const related = computed(() =>
  catalog.relatedBooks(featured.value?.id ?? '', 4),
)

const meta = (book: Book) =>
  `${book.category} · ${book.year} · ${book.pages} pages`

const styles = stylex.create({
  page: {
    minHeight: '100vh',
    padding: spacing.xxl,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontFamily: typography.fontSans,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size2xl,
    fontWeight: typography.weightBold,
    margin: 0,
  },
  subtitle: {
    margin: 0,
    color: colors.textSecondary,
    fontSize: typography.sizeBase,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.sizeXl,
    fontWeight: typography.weightBold,
    marginBottom: spacing.sm,
  },
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  resultCount: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    padding: '4px 12px',
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: '999px',
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    fontFamily: typography.fontSans,
    fontSize: typography.sizeSm,
    cursor: 'pointer',
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: colors.surface,
  },
  bookRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    borderRadius: radii.sm,
    ':hover': {
      backgroundColor: colors.surfaceHover,
    },
  },
  bookInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  bookTitle: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
  },
  bookMeta: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  featuredBadge: {
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.accent,
  },
  bookTools: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  relatedRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBlock: spacing.xs,
  },
  relatedTitle: {
    margin: 0,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
  },
  relatedAuthor: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  pre: {
    margin: 0,
    padding: spacing.md,
    overflowX: 'auto',
    fontFamily: typography.fontSans,
    fontSize: typography.sizeSm,
    lineHeight: 1.6,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
  },
  note: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    lineHeight: typography.leadingNormal,
  },
})
</script>

<template>
  <main
    :class="themeClass"
    :data-ds-theme="preferences.theme"
    v-bind="stylex.attrs(styles.page)"
  >
    <header v-bind="stylex.attrs(styles.header)">
      <div>
        <h1 v-bind="stylex.attrs(styles.title)">Pinia store layer</h1>
        <p v-bind="stylex.attrs(styles.subtitle)">
          The three feature stores (catalog, favorites, preferences) running
          against the real app sources.
        </p>
      </div>
      <ThemeToggle :theme="preferences.theme" @toggle="preferences.toggleTheme()" />
    </header>

    <section v-bind="stylex.attrs(styles.section)">
      <h2 v-bind="stylex.attrs(styles.sectionTitle)">State at a glance</h2>
      <div
        v-bind="stylex.attrs(styles.card)"
        style="display: flex; flex-direction: column; gap: 8px"
      >
        <pre v-bind="stylex.attrs(styles.pre)">{{ snapshot }}</pre>
        <p v-bind="stylex.attrs(styles.note)">
          Live state, re-rendered on every store mutation — no manual
          subscriptions anywhere in this page.
        </p>
      </div>
    </section>

    <section v-bind="stylex.attrs(styles.section)">
      <h2 v-bind="stylex.attrs(styles.sectionTitle)">Catalog store</h2>
      <div v-bind="stylex.attrs(styles.card)">
        <div v-bind="stylex.attrs(styles.toolbar)">
          <SearchField
            v-model="searchQuery"
            placeholder="Search books by title, author or category…"
          />
          <p v-bind="stylex.attrs(styles.resultCount)">
            {{ catalog.filteredBooks.length }} of {{ catalog.books.length }}
            books
          </p>
        </div>
        <div v-bind="stylex.attrs(styles.chips)" role="group" aria-label="Filter by category">
          <button
            v-for="category in catalog.categories"
            :key="category"
            type="button"
            v-bind="stylex.attrs(styles.chip, catalog.selectedCategory === category && styles.chipActive)"
            @click="catalog.setCategory(category)"
          >
            {{ category }}
          </button>
        </div>
        <div :aria-live="'polite'">
          <div v-for="book in catalog.filteredBooks" :key="book.id" v-bind="stylex.attrs(styles.bookRow)">
            <div v-bind="stylex.attrs(styles.bookInfo)">
              <p v-bind="stylex.attrs(styles.bookTitle)">
                {{ book.title }}
                <span v-if="book.featured" v-bind="stylex.attrs(styles.featuredBadge)"> ★</span>
              </p>
              <p v-bind="stylex.attrs(styles.bookMeta)">{{ book.author }} · {{ meta(book) }}</p>
            </div>
            <div v-bind="stylex.attrs(styles.bookTools)">
              <Rating :value="book.rating" />
              <FavoriteButton :book="book" />
            </div>
          </div>
        </div>
        <EmptyState
          v-if="catalog.filteredBooks.length === 0"
          title="No books match"
          message="Try a different search term or category."
        />
      </div>
    </section>

    <section v-bind="stylex.attrs(styles.section)">
      <h2 v-bind="stylex.attrs(styles.sectionTitle)">Derived state</h2>
      <div v-bind="stylex.attrs(styles.card)">
        <template v-if="featured">
          <p v-bind="stylex.attrs(styles.resultCount)">
            Featured book via <code>featuredBook</code>:
            <strong>{{ featured.title }}</strong> by {{ featured.author }}
          </p>
          <p v-bind="stylex.attrs(styles.note)">
            Related titles via <code>relatedBooks(id)</code> (same category
            first, then by rating):
          </p>
          <div v-for="book in related" :key="book.id" v-bind="stylex.attrs(styles.relatedRow)">
            <div v-bind="stylex.attrs(styles.bookInfo)">
              <p v-bind="stylex.attrs(styles.relatedTitle)">{{ book.title }}</p>
              <p v-bind="stylex.attrs(styles.relatedAuthor)">
                {{ book.author }} · {{ book.category }}
              </p>
            </div>
            <div v-bind="stylex.attrs(styles.bookTools)">
              <Rating :value="book.rating" />
              <FavoriteButton :book="book" />
            </div>
          </div>
        </template>
        <p v-else v-bind="stylex.attrs(styles.note)">No featured book set.</p>
      </div>
    </section>

    <section v-bind="stylex.attrs(styles.section)">
      <h2 v-bind="stylex.attrs(styles.sectionTitle)">Favorites store</h2>
      <div v-bind="stylex.attrs(styles.card)">
        <div v-bind="stylex.attrs(styles.toolbar)">
          <p v-bind="stylex.attrs(styles.resultCount)">
            {{ favorites.count }} favorite{{ favorites.count === 1 ? '' : 's' }}
            — persisted to <code>localStorage</code> key <code>shelf:favorites</code>.
          </p>
          <AppButton
            variant="secondary"
            size="sm"
            :disabled="favorites.count === 0"
            @click="clearFavorites"
          >
            Clear favorites
          </AppButton>
        </div>
        <div v-if="favorites.favoriteBooks.length > 0">
          <div
            v-for="book in favorites.favoriteBooks"
            :key="book.id"
            v-bind="stylex.attrs(styles.bookRow)"
          >
            <div v-bind="stylex.attrs(styles.bookInfo)">
              <p v-bind="stylex.attrs(styles.bookTitle)">{{ book.title }}</p>
              <p v-bind="stylex.attrs(styles.bookMeta)">{{ book.author }} · {{ meta(book) }}</p>
            </div>
            <div v-bind="stylex.attrs(styles.bookTools)">
              <Rating :value="book.rating" />
              <FavoriteButton :book="book" />
            </div>
          </div>
        </div>
        <EmptyState
          v-else
          title="No favorites yet"
          message="Tap a heart on any book to add it here."
        />
        <p v-bind="stylex.attrs(styles.note)" style="margin-top: 8px">
          Cross-store: <code>favoriteBooks</code> is derived from the favorites
          ids joined against the catalog store's book list.
        </p>
      </div>
    </section>

    <section v-bind="stylex.attrs(styles.section)">
      <h2 v-bind="stylex.attrs(styles.sectionTitle)">Preferences store</h2>
      <div v-bind="stylex.attrs(styles.card)">
        <div v-bind="stylex.attrs(styles.toolbar)">
          <p v-bind="stylex.attrs(styles.resultCount)">
            Active theme: <strong>{{ preferences.theme }}</strong> — persisted
            to <code>shelf:theme</code>, defaults to the OS scheme.
          </p>
          <AppButton variant="secondary" size="sm" @click="preferences.toggleTheme()">
            Toggle theme
          </AppButton>
        </div>
      </div>
    </section>
  </main>
</template>