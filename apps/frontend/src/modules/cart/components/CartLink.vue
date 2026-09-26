<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { ShoppingCart } from 'lucide-vue-next'
import { focusRing } from '../../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCartStore } from '../stores/cart.store'

const cart = useCartStore()

const label = computed(() =>
  cart.count === 0
    ? 'Cart, empty'
    : `Cart, ${cart.count} item${cart.count === 1 ? '' : 's'}`,
)

const styles = stylex.create({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: '6px 10px',
    borderRadius: radii.circle,
    color: colors.textSecondary,
    textDecoration: 'none',
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      color: colors.textPrimary,
      backgroundColor: colors.surfaceHover,
    },
  },
  icon: {
    display: 'flex',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    height: 18,
    paddingInline: '4px',
    borderRadius: radii.circle,
    backgroundColor: colors.accent,
    color: colors.textOnAccent,
    fontSize: typography.sizeXs,
    fontWeight: typography.weightBold,
  },
})
</script>

<template>
  <RouterLink
    to="/cart"
    :aria-label="label"
    v-bind="stylex.attrs(styles.link, focusRing.visible)"
  >
    <span v-bind="stylex.attrs(styles.icon)">
      <ShoppingCart :size="18" aria-hidden="true" />
    </span>
    <span
      v-if="cart.count > 0"
      v-bind="stylex.attrs(styles.badge)"
      aria-live="polite"
      >{{ cart.count }}</span
    >
  </RouterLink>
</template>