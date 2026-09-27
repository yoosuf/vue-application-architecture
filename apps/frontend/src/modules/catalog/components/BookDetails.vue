<script setup lang="ts">
import { computed, ref } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { RotateCcw, Truck } from 'lucide-vue-next'
import BookGallery from './BookGallery.vue'
import Tabs from '@vue-application-architecture/design-system/ui/molecules/Tabs.vue'
import Rating from '@vue-application-architecture/design-system/ui/atoms/Rating.vue'
import { FavoriteButton } from '../../favorites'
import { AddToCartButton } from '../../cart'
import { formatCurrency, formatDate } from '../../core'
import {
  colors,
  layout,
  radii,
  shadows,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import type { Book } from '@vue-application-architecture/types/book'

const { book } = defineProps<{
  book: Book
}>()

const activeTab = ref(0)

const savingsCents = computed(() =>
  Math.max(0, book.listPriceCents - book.priceCents),
)
const savingsPercent = computed(() =>
  book.listPriceCents > 0
    ? Math.round((savingsCents.value / book.listPriceCents) * 100)
    : 0,
)
const estimatedDelivery = computed(() => {
  const hash = [...book.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return formatDate(Date.now() + (2 + (hash % 4)) * 86_400_000, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
})

const styles = stylex.create({
  root: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlockStart: spacing.xs,
    paddingBlockEnd: spacing.md,
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 320px) minmax(0, 1fr)',
      '@media (max-width: 900px)': 'minmax(0, 1fr)',
    },
    gap: {
      default: spacing.lg,
      '@media (max-width: 900px)': spacing.sm,
    },
    alignItems: 'start',
  },
  cover: {
    width: '100%',
    maxWidth: 320,
    margin: '0 auto',
    '@media (max-width: 600px)': {
      maxWidth: 240,
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xxs,
    maxWidth: '64ch',
  },
  category: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.accent,
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size2xl,
    lineHeight: typography.leadingTight,
    letterSpacing: '-0.01em',
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    '@media (max-width: 600px)': {
      fontSize: typography.sizeXl,
    },
  },
  author: {
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingSnug,
    color: colors.textSecondary,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
  },
  metaDot: {
    fontSize: typography.sizeSm,
    color: colors.borderStrong,
  },
  description: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  priceGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xxs,
  },
  priceLine: {
    display: 'flex',
    alignItems: 'baseline',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: typography.size2xl,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingTight,
    color: colors.textPrimary,
    letterSpacing: '-0.01em',
  },
  listPrice: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingTight,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    paddingBlock: '2px',
    paddingInline: spacing.sm,
    borderRadius: radii.circle,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingTight,
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    margin: 0,
    paddingBlockEnd: '4px',
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radii.circle,
    backgroundColor: colors.accent,
  },
  addRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: spacing.sm,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  serviceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  serviceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  serviceIcon: {
    display: 'flex',
    color: colors.accent,
  },
  serviceText: {
    margin: 0,
    fontSize: typography.sizeSm,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  buyBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    marginTop: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    maxWidth: 460,
    '@media (max-width: 600px)': {
      padding: spacing.xs,
    },
  },
  tabsWrap: {
    display: 'flex',
    flexDirection: 'column',
    paddingBlockStart: spacing.xs,
  },
  specList: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: `1px solid ${colors.border}`,
  },
  specRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBlock: spacing.sm,
    borderBottom: `1px solid ${colors.border}`,
  },
  specKey: {
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
})
</script>

<template>
  <article
    v-bind="stylex.attrs(styles.root)"
    aria-labelledby="book-details-title"
  >
    <div v-bind="stylex.attrs(styles.cover)">
      <BookGallery
        :srcs="book.galleryUrls"
        :alt="`${book.title} by ${book.author}`"
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
        <span v-bind="stylex.attrs(styles.metaDot)" aria-hidden="true">·</span>
        <span v-bind="stylex.attrs(styles.stat)">{{ book.pages }} pages</span>
        <span v-bind="stylex.attrs(styles.metaDot)" aria-hidden="true">·</span>
        <Rating :value="book.rating" />
      </div>

      <div v-bind="stylex.attrs(styles.buyBox)">
        <div v-bind="stylex.attrs(styles.priceRow)">
          <span v-bind="stylex.attrs(styles.priceGroup)">
            <span v-bind="stylex.attrs(styles.priceLine)">
              <p v-bind="stylex.attrs(styles.price)">
                {{ formatCurrency(book.priceCents) }}
              </p>
              <p v-bind="stylex.attrs(styles.listPrice)">
                {{ formatCurrency(book.listPriceCents) }}
              </p>
            </span>
            <p v-if="savingsCents > 0" v-bind="stylex.attrs(styles.saveBadge)">
              Save {{ formatCurrency(savingsCents) }} ({{ savingsPercent }}%)
            </p>
          </span>
          <p v-bind="stylex.attrs(styles.status)">
            <span v-bind="stylex.attrs(styles.statusDot)" aria-hidden="true" />
            In stock
          </p>
        </div>

        <div v-bind="stylex.attrs(styles.addRow)">
          <AddToCartButton :book="book" size="lg" block persistent />
          <FavoriteButton :book="book" />
        </div>

        <div v-bind="stylex.attrs(styles.divider)" />

        <ul v-bind="stylex.attrs(styles.serviceList)">
          <li v-bind="stylex.attrs(styles.serviceRow)">
            <span v-bind="stylex.attrs(styles.serviceIcon)">
              <Truck :size="16" aria-hidden="true" />
            </span>
            <p v-bind="stylex.attrs(styles.serviceText)">
              Arrives by {{ estimatedDelivery }}
            </p>
          </li>
          <li v-bind="stylex.attrs(styles.serviceRow)">
            <span v-bind="stylex.attrs(styles.serviceIcon)">
              <RotateCcw :size="16" aria-hidden="true" />
            </span>
            <p v-bind="stylex.attrs(styles.serviceText)">
              Ships in 1–2 business days · Free 30-day returns
            </p>
          </li>
        </ul>
      </div>

      <div v-bind="stylex.attrs(styles.tabsWrap)">
        <Tabs
          v-model="activeTab"
          :labels="['About this book', 'Product details']"
          label="Book information"
        >
          <template #default="{ index }">
            <p v-if="index === 0" v-bind="stylex.attrs(styles.description)">
              {{ book.description }}
            </p>

            <div v-else-if="index === 1" v-bind="stylex.attrs(styles.specList)">
              <div v-bind="stylex.attrs(styles.specRow)">
                <span v-bind="stylex.attrs(styles.specKey)">Category</span>
                <span v-bind="stylex.attrs(styles.specValue)">{{
                  book.category
                }}</span>
              </div>
              <div v-bind="stylex.attrs(styles.specRow)">
                <span v-bind="stylex.attrs(styles.specKey)">Published</span>
                <span v-bind="stylex.attrs(styles.specValue)">{{
                  book.year
                }}</span>
              </div>
              <div v-bind="stylex.attrs(styles.specRow)">
                <span v-bind="stylex.attrs(styles.specKey)">Pages</span>
                <span v-bind="stylex.attrs(styles.specValue)">{{
                  book.pages
                }}</span>
              </div>
              <div v-bind="stylex.attrs(styles.specRow)">
                <span v-bind="stylex.attrs(styles.specKey)">Rating</span>
                <span v-bind="stylex.attrs(styles.specValue)">
                  {{ book.rating.toFixed(1) }} / 5
                </span>
              </div>
            </div>
          </template>
        </Tabs>
      </div>
    </div>
  </article>
</template>
