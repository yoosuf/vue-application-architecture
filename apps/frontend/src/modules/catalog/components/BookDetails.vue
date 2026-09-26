<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { ArrowLeft } from 'lucide-vue-next'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import BookCover from './BookCover.vue'
import Rating from '@vue-application-architecture/design-system/ui/atoms/Rating.vue'
import { FavoriteButton } from '../../favorites'
import { AddToCartButton, formatPrice } from '../../cart'
import { focusRing } from '../../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  layout,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import type { Book } from '@vue-application-architecture/types/book'

defineProps<{
  book: Book
}>()

const styles = stylex.create({
  root: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlockStart: spacing.sm,
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 320px) minmax(0, 1fr)',
      '@media (max-width: 900px)': 'minmax(0, 1fr)',
    },
    gap: {
      default: spacing.xxl,
      '@media (max-width: 900px)': spacing.lg,
    },
    alignItems: 'start',
  },
  cover: {
    width: '100%',
    maxWidth: 320,
    margin: '0 auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    maxWidth: '64ch',
  },
  category: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    padding: '6px 14px',
    borderRadius: radii.circle,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size4xl,
    lineHeight: typography.leadingTight,
    letterSpacing: '-0.02em',
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    '@media (max-width: 600px)': {
      fontSize: typography.size3xl,
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
    fontSize: typography.sizeLg,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  price: {
    fontSize: typography.size2xl,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingTight,
    color: colors.textPrimary,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
    textDecoration: 'none',
    ':hover': {
      color: colors.textPrimary,
    },
  },
})
</script>

<template>
  <article
    v-bind="stylex.attrs(styles.root)"
    aria-labelledby="book-details-title"
  >
    <div v-bind="stylex.attrs(styles.cover)">
      <BookCover
        :src="book.coverUrl"
        :alt="`Cover of ${book.title} by ${book.author}`"
        priority
      />
    </div>

    <div v-bind="stylex.attrs(styles.details)">
      <p v-bind="stylex.attrs(styles.category)">{{ book.category }}</p>

      <h1 id="book-details-title" v-bind="stylex.attrs(styles.title)">
        {{ book.title }}
      </h1>

      <p v-bind="stylex.attrs(styles.author)">by {{ book.author }}</p>

      <div v-bind="stylex.attrs(styles.metaRow)">
        <span v-bind="stylex.attrs(styles.stat)">
          Published {{ book.year }}
        </span>
        <span v-bind="stylex.attrs(styles.stat)">{{ book.pages }} pages</span>
        <Rating :value="book.rating" />
      </div>

      <p v-bind="stylex.attrs(styles.description)">{{ book.description }}</p>

      <p v-bind="stylex.attrs(styles.price)">{{ formatPrice(book.priceCents) }}</p>

      <div v-bind="stylex.attrs(styles.actions)">
        <AddToCartButton :book="book" size="lg" />
        <FavoriteButton :book="book" />
        <AppButton variant="secondary" size="md" :to="{ name: 'explore' }">
          Explore More Books
        </AppButton>
      </div>

      <RouterLink to="/" v-bind="stylex.attrs(styles.back, focusRing.visible)">
        <ArrowLeft :size="14" aria-hidden="true" />
        Back to Explore
      </RouterLink>
    </div>
  </article>
</template>
