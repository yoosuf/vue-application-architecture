<script setup lang="ts">
import { computed } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { ShoppingCart } from 'lucide-vue-next'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import QuantityStepper from '@vue-application-architecture/design-system/ui/atoms/QuantityStepper.vue'
import { colors } from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCartStore } from '../stores/cart.store'
import type { Book } from '@vue-application-architecture/types/book'

const props = withDefaults(
  defineProps<{
    book: Book
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'sm',
  },
)

const cart = useCartStore()

const inCart = computed(() => cart.isInCart(props.book.id))

const quantity = computed({
  get: () => cart.quantityFor(props.book.id),
  set: (value: number) => cart.setQuantity(props.book.id, value),
})

function add() {
  cart.addBook(props.book.id)
}

const styles = stylex.create({
  icon: {
    display: 'flex',
    color: colors.textOnAccent,
  },
})
</script>

<template>
  <AppButton v-if="!inCart" :size="props.size" @click="add">
    <span v-bind="stylex.attrs(styles.icon)">
      <ShoppingCart :size="16" aria-hidden="true" />
    </span>
    Add to Cart
  </AppButton>
  <QuantityStepper
    v-else
    v-model="quantity"
    :label="`Quantity of ${props.book.title}`"
  />
</template>