<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { computed } from 'vue'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import BookCover from './BookCover.vue'
import Rating from '@vue-application-architecture/design-system/ui/atoms/Rating.vue'
import { AddToCartButton } from '../../cart'
import { useCatalogStore } from '../stores/catalog.store'
import {
  colors,
  layout,
  radii,
  shadows,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const catalog = useCatalogStore()

const featured = computed(() => catalog.featuredBook)

const detailsRoute = computed(() =>
  featured.value
    ? { name: 'book-details', params: { id: featured.value.id } }
    : { name: 'explore' },
)

const styles = stylex.create({
  root: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlockStart: spacing.xxl,
    paddingBlockEnd: spacing.md,
  },
  panel: {
    padding: spacing.xxl,
    borderRadius: radii.lg,
    backgroundColor: colors.accentSoft,
    boxShadow: shadows.card,
    '@media (max-width: 760px)': {
      padding: spacing.lg,
    },
    '@media (max-width: 480px)': {
      padding: spacing.md,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 240px) minmax(0, 1fr)',
      '@media (max-width: 760px)': 'minmax(0, 1fr)',
    },
    gap: {
      default: spacing.xxl,
      '@media (max-width: 760px)': spacing.lg,
    },
    alignItems: 'center',
  },
  coverColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 240,
    margin: '0 auto',
    width: '100%',
  },
  copy: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    maxWidth: '56ch',
  },
  overline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: typography.sizeXs,
    fontWeight: typography.weightBold,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: colors.accent,
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size4xl,
    lineHeight: typography.leadingTight,
    letterSpacing: '-0.02em',
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    '@media (max-width: 760px)': {
      fontSize: typography.size3xl,
    },
    '@media (max-width: 480px)': {
      fontSize: typography.size2xl,
    },
  },
  author: {
    fontSize: typography.sizeLg,
    lineHeight: typography.leadingSnug,
    color: colors.textSecondary,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
  },
  description: {
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
})
</script>

<template>
  <section
    v-if="featured"
    v-bind="stylex.attrs(styles.root)"
    aria-labelledby="featured-title"
  >
    <div v-bind="stylex.attrs(styles.panel)">
      <div v-bind="stylex.attrs(styles.grid)">
        <div v-bind="stylex.attrs(styles.coverColumn)">
          <BookCover
            :src="featured.coverUrl"
            :alt="`Cover of ${featured.title} by ${featured.author}`"
            priority
          />
        </div>

        <div v-bind="stylex.attrs(styles.copy)">
          <p v-bind="stylex.attrs(styles.overline)">Featured Book</p>

          <h1 id="featured-title" v-bind="stylex.attrs(styles.title)">
            {{ featured.title }}
          </h1>

          <p v-bind="stylex.attrs(styles.author)">{{ featured.author }}</p>

          <div v-bind="stylex.attrs(styles.metaRow)">
            <span v-bind="stylex.attrs(styles.stat)">
              {{ featured.category }} · {{ featured.year }}
            </span>
            <Rating :value="featured.rating" />
          </div>

          <p v-bind="stylex.attrs(styles.description)">
            {{ featured.description }}
          </p>

          <div v-bind="stylex.attrs(styles.action)">
            <AddToCartButton :book="featured" size="lg" persistent />
            <AppButton :to="detailsRoute" size="lg" variant="secondary">
              View Book
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
