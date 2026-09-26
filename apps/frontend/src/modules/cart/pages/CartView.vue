<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import CartLine from '../components/CartLine.vue'
import OrderSummary from '../components/OrderSummary.vue'
import {
  colors,
  layout,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCartStore } from '../stores/cart.store'
import { formatPrice } from '../utils/money'

const cart = useCartStore()

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
  layout: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) minmax(280px, 360px)',
      '@media (max-width: 860px)': 'minmax(0, 1fr)',
    },
    gap: spacing.xl,
    alignItems: 'start',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing.md,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
})
</script>

<template>
  <section v-bind="stylex.attrs(styles.section)" aria-label="Your cart">
    <template v-if="cart.lineCount > 0">
      <div v-bind="stylex.attrs(styles.headingRow)">
        <h1 v-bind="stylex.attrs(styles.heading)">Your Cart</h1>
        <p v-bind="stylex.attrs(styles.resultCount)" role="status">
          {{ cart.count }}
          {{ cart.count === 1 ? 'book' : 'books' }} ·
          {{ formatPrice(cart.subtotalCents) }} subtotal
        </p>
      </div>

      <div v-bind="stylex.attrs(styles.layout)">
        <div v-bind="stylex.attrs(styles.lines)">
          <CartLine
            v-for="line in cart.entries"
            :key="line.book.id"
            :book="line.book"
            :quantity="line.quantity"
          />
        </div>

        <div v-bind="stylex.attrs(styles.sidebar)">
          <OrderSummary />
          <AppButton :to="{ name: 'checkout' }" size="lg">
            Proceed to Checkout
          </AppButton>
          <AppButton variant="secondary" :to="{ name: 'explore' }">
            Continue Shopping
          </AppButton>
        </div>
      </div>
    </template>

    <EmptyState
      v-else
      heading-level="h1"
      title="Your cart is empty."
      message="Browse the catalog and add a few books before you check out."
    >
      <AppButton :to="{ name: 'explore' }">Explore Books</AppButton>
    </EmptyState>
  </section>
</template>