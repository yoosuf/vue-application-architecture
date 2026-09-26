<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { computed, useSlots } from 'vue'
import BookCover from './BookCover.vue'
import BookMeta from './BookMeta.vue'
import Rating from '@vue-application-architecture/design-system/ui/atoms/Rating.vue'
import { formatPrice } from '../../cart'
import {
  focusRing,
  reducedMotion,
} from '../../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  shadows,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import type { Book } from '@vue-application-architecture/types/book'

const props = defineProps<{
  book: Book
}>()

const slots = useSlots()
const hasFooter = computed(() => Boolean(slots.footer))

const detailsRoute = computed(() => ({
  name: 'book-details',
  params: { id: props.book.id },
}))

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  link: {
    display: 'block',
    borderRadius: radii.sm,
    textDecoration: 'none',
    transition: `transform ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}`,
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: shadows.cardHover,
    },
    '@media (max-width: 480px)': {
      maxWidth: 240,
      margin: '0 auto',
    },
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTop: `1px solid ${colors.border}`,
  },
  footerMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  footerRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: spacing.sm,
    alignItems: 'center',
  },
  price: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingSnug,
    color: colors.textPrimary,
  },
})
</script>

<template>
  <article v-bind="stylex.attrs(styles.root)">
    <RouterLink
      :to="detailsRoute"
      :aria-label="`${book.title} by ${book.author}`"
      v-bind="stylex.attrs(styles.link, focusRing.visible, reducedMotion.root)"
    >
      <BookCover
        :src="book.coverUrl"
        :alt="`Cover of ${book.title} by ${book.author}`"
        :priority="book.featured"
        zoom-on-hover
      />
    </RouterLink>

    <div v-bind="stylex.attrs(styles.body)">
      <BookMeta
        :title="book.title"
        :author="book.author"
        :category="book.category"
        :year="book.year"
      />

      <div v-bind="stylex.attrs(styles.footer)">
        <div v-bind="stylex.attrs(styles.footerMeta)">
          <Rating :value="book.rating" />
          <span
            v-bind="stylex.attrs(styles.price)"
            :aria-label="`Price ${formatPrice(book.priceCents)}`"
            >{{ formatPrice(book.priceCents) }}</span
          >
        </div>
        <div v-if="hasFooter" v-bind="stylex.attrs(styles.footerRow)">
          <slot name="footer" :book="book" />
        </div>
      </div>
    </div>
  </article>
</template>
