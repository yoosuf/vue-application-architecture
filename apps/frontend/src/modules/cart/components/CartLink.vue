<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { ShoppingCart } from 'lucide-vue-next'
import {
  buttonReset,
  focusRing,
  reducedMotion,
} from '../../../../../../packages/design-system/src/styles/shared.stylex'
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

const badgePop = stylex.keyframes({
  '0%': { transform: 'scale(0.6)' },
  '55%': { transform: 'scale(1.15)' },
  '100%': { transform: 'scale(1)' },
})

const styles = stylex.create({
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: '6px 10px',
    borderRadius: radii.circle,
    color: colors.textSecondary,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    whiteSpace: 'nowrap',
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      color: colors.textPrimary,
      backgroundColor: colors.surfaceHover,
    },
  },
  icon: {
    display: 'flex',
  },
  label: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingSnug,
    '@media (max-width: 560px)': {
      display: 'none',
    },
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
  badgeBump: {
    animationName: badgePop,
    animationDuration: motion.base,
    animationTimingFunction: motion.easeOut,
    animationIterationCount: 1,
  },
})
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :aria-haspopup="'dialog'"
    :aria-expanded="cart.isCartOpen"
    @click="cart.toggleCart"
    v-bind="stylex.attrs(buttonReset.root, styles.trigger, focusRing.visible)"
  >
    <span v-bind="stylex.attrs(styles.icon)">
      <ShoppingCart :size="18" aria-hidden="true" />
    </span>
    <span v-bind="stylex.attrs(styles.label)">Cart</span>
    <span
      v-if="cart.count > 0"
      :key="cart.count"
      v-bind="stylex.attrs(styles.badge, styles.badgeBump, reducedMotion.root)"
      aria-live="polite"
      >{{ cart.count }}</span
    >
  </button>
</template>
