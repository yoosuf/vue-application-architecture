<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { Check, ShoppingCart } from 'lucide-vue-next'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import QuantityStepper from '@vue-application-architecture/design-system/ui/atoms/QuantityStepper.vue'
import { reducedMotion } from '../../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  motion,
  spacing,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCartStore } from '../stores/cart.store'
import type { Book } from '@vue-application-architecture/types/book'

const props = withDefaults(
  defineProps<{
    book: Book
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    persistent?: boolean
  }>(),
  {
    size: 'sm',
    block: false,
    persistent: false,
  },
)

const cart = useCartStore()

const inCart = computed(() => cart.isInCart(props.book.id))
const added = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

const label = computed(() => {
  if (added.value) return 'Added'
  if (inCart.value && props.persistent) return 'Update Cart'
  return 'Add to Cart'
})

const showCheck = computed(
  () => added.value || (inCart.value && props.persistent),
)

function add() {
  cart.addBook(props.book.id)
  cart.openCart()
  added.value = true
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    added.value = false
  }, 1100)
}

watch(
  () => props.book.id,
  () => {
    if (resetTimer) clearTimeout(resetTimer)
    added.value = false
  },
)

onUnmounted(() => {
  if (resetTimer) clearTimeout(resetTimer)
})

const quantity = computed({
  get: () => cart.quantityFor(props.book.id),
  set: (value: number) => cart.setQuantity(props.book.id, value),
})

const addedPop = stylex.keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.06)' },
  '100%': { transform: 'scale(1)' },
})

const styles = stylex.create({
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonFill: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  labelAdded: {
    animationName: addedPop,
    animationDuration: motion.base,
    animationTimingFunction: motion.easeOut,
    animationIterationCount: 1,
  },
  icon: {
    display: 'flex',
    color: colors.textOnAccent,
  },
})
</script>

<template>
  <span
    v-if="props.persistent && inCart"
    v-bind="stylex.attrs(styles.controls)"
  >
    <QuantityStepper
      v-model="quantity"
      :label="`Quantity of ${props.book.title}`"
    />
    <span v-if="props.block" v-bind="stylex.attrs(styles.buttonFill)">
      <AppButton :size="props.size" :block="props.block" @click="add">
        <span
          :key="label"
          v-bind="
            stylex.attrs(
              styles.label,
              added && styles.labelAdded,
              reducedMotion.root,
            )
          "
        >
          <span v-if="showCheck" v-bind="stylex.attrs(styles.icon)">
            <Check :size="16" aria-hidden="true" />
          </span>
          <span v-else v-bind="stylex.attrs(styles.icon)">
            <ShoppingCart :size="16" aria-hidden="true" />
          </span>
          {{ label }}
        </span>
      </AppButton>
    </span>
    <AppButton v-else :size="props.size" :block="props.block" @click="add">
      <span
        :key="label"
        v-bind="
          stylex.attrs(
            styles.label,
            added && styles.labelAdded,
            reducedMotion.root,
          )
        "
      >
        <span v-if="showCheck" v-bind="stylex.attrs(styles.icon)">
          <Check :size="16" aria-hidden="true" />
        </span>
        <span v-else v-bind="stylex.attrs(styles.icon)">
          <ShoppingCart :size="16" aria-hidden="true" />
        </span>
        {{ label }}
      </span>
    </AppButton>
  </span>

  <template v-else>
    <AppButton
      v-if="!inCart || added || props.persistent"
      :size="props.size"
      :block="props.block"
      @click="add"
    >
      <span
        :key="label"
        v-bind="
          stylex.attrs(
            styles.label,
            added && styles.labelAdded,
            reducedMotion.root,
          )
        "
      >
        <span v-if="showCheck" v-bind="stylex.attrs(styles.icon)">
          <Check :size="16" aria-hidden="true" />
        </span>
        <span v-else v-bind="stylex.attrs(styles.icon)">
          <ShoppingCart :size="16" aria-hidden="true" />
        </span>
        {{ label }}
      </span>
    </AppButton>
    <QuantityStepper
      v-else
      v-model="quantity"
      :label="`Quantity of ${props.book.title}`"
    />
  </template>
</template>
