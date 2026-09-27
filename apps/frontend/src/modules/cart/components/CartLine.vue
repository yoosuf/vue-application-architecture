<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { Trash2 } from 'lucide-vue-next'
import IconButton from '@vue-application-architecture/design-system/ui/atoms/IconButton.vue'
import QuantityStepper from '@vue-application-architecture/design-system/ui/atoms/QuantityStepper.vue'
import {
  colors,
  motion,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { BookCover } from '../../catalog'
import { useCartStore } from '../stores/cart.store'
import { formatCurrency } from '../../core'
import type { Book } from '@vue-application-architecture/types/book'

const props = withDefaults(
  defineProps<{
    book: Book
    quantity: number
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const cart = useCartStore()

const quantity = computed({
  get: () => props.quantity,
  set: (value: number) => cart.setQuantity(props.book.id, value),
})

const lineTotal = computed(() => props.book.priceCents * props.quantity)

const detailsRoute = computed(() => ({
  name: 'book-details',
  params: { id: props.book.id },
}))

const styles = stylex.create({
  rootBase: {
    gap: spacing.md,
    paddingBlock: spacing.xs,
    paddingInline: spacing.xs,
    marginBlock: 2,
    borderRadius: radii.md,
    backgroundColor: 'transparent',
    transition: `background-color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      backgroundColor: colors.surfaceHover,
    },
  },
  rootWide: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto auto auto',
    alignItems: 'center',
  },
  rootCompact: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
    gridTemplateRows: 'auto auto',
    alignItems: 'start',
    columnGap: spacing.sm,
    rowGap: spacing.xs,
  },
  coverWide: {
    width: 52,
  },
  coverCompact: {
    width: 48,
    gridRow: '1 / span 2',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ':hover': {
      color: colors.accent,
    },
  },
  meta: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  unitPrice: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  lineTotal: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    whiteSpace: 'nowrap',
  },
  controlsRow: {
    gridColumn: '2 / -1',
    gridRow: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
})
</script>

<template>
  <div
    v-bind="
      stylex.attrs(
        styles.rootBase,
        props.compact ? styles.rootCompact : styles.rootWide,
      )
    "
  >
    <RouterLink :to="detailsRoute" :aria-label="`${props.book.title} details`">
      <div
        v-bind="
          stylex.attrs(props.compact ? styles.coverCompact : styles.coverWide)
        "
      >
        <BookCover
          :src="props.book.coverUrl"
          :alt="`Cover of ${props.book.title} by ${props.book.author}`"
        />
      </div>
    </RouterLink>

    <div v-bind="stylex.attrs(styles.info)">
      <RouterLink :to="detailsRoute" v-bind="stylex.attrs(styles.title)">
        {{ props.book.title }}
      </RouterLink>
      <p v-bind="stylex.attrs(styles.meta)">by {{ props.book.author }}</p>
      <p v-if="!props.compact" v-bind="stylex.attrs(styles.unitPrice)">
        {{ formatCurrency(props.book.priceCents) }} each
      </p>
    </div>

    <template v-if="props.compact">
      <p v-bind="stylex.attrs(styles.lineTotal)">
        {{ formatCurrency(lineTotal) }}
      </p>
      <IconButton
        :label="`Remove ${props.book.title} from cart`"
        @click="cart.removeBook(props.book.id)"
      >
        <Trash2 :size="18" aria-hidden="true" />
      </IconButton>
      <div v-bind="stylex.attrs(styles.controlsRow)">
        <QuantityStepper
          v-model="quantity"
          :label="`Quantity of ${props.book.title}`"
        />
        <p v-bind="stylex.attrs(styles.unitPrice)">
          {{ formatCurrency(props.book.priceCents) }} each
        </p>
      </div>
    </template>

    <template v-else>
      <QuantityStepper
        v-model="quantity"
        :label="`Quantity of ${props.book.title}`"
      />

      <p v-bind="stylex.attrs(styles.lineTotal)">
        {{ formatCurrency(lineTotal) }}
      </p>

      <IconButton
        :label="`Remove ${props.book.title} from cart`"
        @click="cart.removeBook(props.book.id)"
      >
        <Trash2 :size="18" aria-hidden="true" />
      </IconButton>
    </template>
  </div>
</template>
