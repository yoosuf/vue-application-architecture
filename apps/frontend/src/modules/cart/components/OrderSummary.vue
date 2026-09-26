<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import {
  colors,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCartStore } from '../stores/cart.store'
import {
  formatPrice,
  SHIPPING_FREE_THRESHOLD_CENTS,
} from '../utils/money'

const cart = useCartStore()

const itemLabel = computed(() =>
  cart.count === 1 ? '1 item' : `${cart.count} items`,
)

const shippingLabel = computed(() => {
  if (cart.count === 0) return '—'
  return cart.shippingCents === 0 ? 'Free' : formatPrice(cart.shippingCents)
})

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
  },
  title: {
    margin: 0,
    fontFamily: typography.fontDisplay,
    fontSize: typography.sizeXl,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  count: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
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
  <aside v-bind="stylex.attrs(styles.root)" aria-label="Order summary">
    <div>
      <h2 v-bind="stylex.attrs(styles.title)">Order Summary</h2>
      <p v-bind="stylex.attrs(styles.count)">{{ itemLabel }}</p>
    </div>

    <div v-bind="stylex.attrs(styles.row)">
      <span>Subtotal</span>
      <span v-bind="stylex.attrs(styles.rowValue)">{{
        formatPrice(cart.subtotalCents)
      }}</span>
    </div>
    <div v-bind="stylex.attrs(styles.row)">
      <span>Shipping</span>
      <span v-bind="stylex.attrs(styles.rowValue)">{{ shippingLabel }}</span>
    </div>

    <div v-bind="stylex.attrs(styles.divider)" />

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
  </aside>
</template>