<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import {
  colors,
  motion,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCartStore } from '../stores/cart.store'
import { formatPrice, SHIPPING_FREE_THRESHOLD_CENTS } from '../utils/money'

const cart = useCartStore()

const itemLabel = computed(() =>
  cart.count === 1 ? '1 item' : `${cart.count} items`,
)

const shippingLabel = computed(() => {
  if (cart.count === 0) return '—'
  return cart.shippingCents === 0 ? 'Free' : formatPrice(cart.shippingCents)
})

const shippingMessage = computed(() => {
  if (cart.count === 0) {
    return `Free shipping on orders over ${formatPrice(SHIPPING_FREE_THRESHOLD_CENTS)}.`
  }
  if (cart.shippingCents === 0) {
    return 'Free shipping unlocked.'
  }
  const remaining = SHIPPING_FREE_THRESHOLD_CENTS - cart.subtotalCents
  return `${formatPrice(Math.max(0, remaining))} away from free shipping.`
})

const shippingProgress = computed(() => {
  if (cart.count === 0) return 0
  return Math.min(
    100,
    Math.round((cart.subtotalCents / SHIPPING_FREE_THRESHOLD_CENTS) * 100),
  )
})

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
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
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    fontSize: typography.sizeBase,
  },
  itemTitle: {
    minWidth: 0,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  itemQty: {
    marginInlineStart: spacing.xs,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightRegular,
    color: colors.textSecondary,
  },
  itemAmount: {
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    whiteSpace: 'nowrap',
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
  progressTrack: {
    height: 6,
    borderRadius: radii.circle,
    backgroundColor: colors.surfaceHover,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.circle,
    backgroundColor: colors.accent,
    transition: `width ${motion.base} ${motion.easeOut}`,
  },
})
</script>

<template>
  <aside v-bind="stylex.attrs(styles.root)" aria-label="Order summary">
    <div>
      <h2 v-bind="stylex.attrs(styles.title)">Order Summary</h2>
      <p v-bind="stylex.attrs(styles.count)">{{ itemLabel }}</p>
    </div>

    <ul v-if="cart.entries.length > 0" v-bind="stylex.attrs(styles.items)">
      <li
        v-for="line in cart.entries"
        :key="line.book.id"
        v-bind="stylex.attrs(styles.item)"
      >
        <span v-bind="stylex.attrs(styles.itemTitle)">
          {{ line.book.title }}
          <span v-bind="stylex.attrs(styles.itemQty)"
            >× {{ line.quantity }}</span
          >
        </span>
        <span v-bind="stylex.attrs(styles.itemAmount)">{{
          formatPrice(line.lineTotalCents)
        }}</span>
      </li>
    </ul>

    <div v-if="cart.entries.length > 0" v-bind="stylex.attrs(styles.divider)" />

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

    <div v-if="cart.entries.length > 0" v-bind="stylex.attrs(styles.divider)" />

    <div v-bind="stylex.attrs(styles.row, styles.total)">
      <span>Total</span>
      <span v-bind="stylex.attrs(styles.rowValue, styles.total)">
        {{ formatPrice(cart.totalCents) }}
      </span>
    </div>

    <div
      v-if="cart.count > 0"
      v-bind="stylex.attrs(styles.progressTrack)"
      role="progressbar"
      aria-label="Progress toward free shipping"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="shippingProgress"
    >
      <div
        v-bind="stylex.attrs(styles.progressFill)"
        :style="{ width: `${shippingProgress}%` }"
      />
    </div>

    <p v-bind="stylex.attrs(styles.note)">{{ shippingMessage }}</p>
  </aside>
</template>
