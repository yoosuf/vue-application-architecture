<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Drawer from '@vue-application-architecture/design-system/ui/molecules/Drawer.vue'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import CartLine from './CartLine.vue'
import {
  colors,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCartStore } from '../stores/cart.store'
import { formatPrice, SHIPPING_FREE_THRESHOLD_CENTS } from '../utils/money'
import * as stylex from '@stylexjs/stylex'

const cart = useCartStore()
const router = useRouter()

const shippingLabel = computed(() => {
  if (cart.lineCount === 0) return '—'
  return cart.shippingCents === 0 ? 'Free' : formatPrice(cart.shippingCents)
})

function goTo(path: string) {
  cart.closeCart()
  router.push(path)
}

const styles = stylex.create({
  lines: {
    display: 'flex',
    flexDirection: 'column',
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    fontSize: typography.sizeBase,
    color: colors.textPrimary,
  },
  rowValue: {
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  total: {
    fontSize: typography.sizeLg,
    fontWeight: typography.weightBold,
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
  <Drawer :open="cart.isCartOpen" title="Your Cart" @close="cart.closeCart">
    <template v-if="cart.lineCount > 0">
      <div v-bind="stylex.attrs(styles.lines)">
        <CartLine
          v-for="line in cart.entries"
          :key="line.book.id"
          :book="line.book"
          :quantity="line.quantity"
          compact
        />
      </div>
    </template>

    <EmptyState
      v-else
      title="Your cart is empty."
      message="Browse the catalog and add a few books before you check out."
    >
      <AppButton @click="goTo('/')">Browse Books</AppButton>
    </EmptyState>

    <template v-if="cart.lineCount > 0" #footer>
      <div v-bind="stylex.attrs(styles.summary)">
        <div v-bind="stylex.attrs(styles.row)">
          <span>Subtotal</span>
          <span v-bind="stylex.attrs(styles.rowValue)">{{
            formatPrice(cart.subtotalCents)
          }}</span>
        </div>
        <div v-bind="stylex.attrs(styles.row)">
          <span>Shipping</span>
          <span v-bind="stylex.attrs(styles.rowValue)">{{
            shippingLabel
          }}</span>
        </div>
        <div v-bind="stylex.attrs(styles.row, styles.total)">
          <span>Total</span>
          <span v-bind="stylex.attrs(styles.rowValue, styles.total)">
            {{ formatPrice(cart.totalCents) }}
          </span>
        </div>
        <p v-bind="stylex.attrs(styles.note)">
          Free shipping on orders over
          {{ formatPrice(SHIPPING_FREE_THRESHOLD_CENTS) }}.
        </p>
      </div>

      <AppButton size="lg" @click="goTo('/checkout')">Checkout</AppButton>
      <AppButton variant="secondary" @click="goTo('/cart')">
        View Cart
      </AppButton>
    </template>
  </Drawer>
</template>
