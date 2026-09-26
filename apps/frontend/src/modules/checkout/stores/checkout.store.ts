import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCartStore } from '../../cart'

export interface CheckoutDetails {
  email: string
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  zip: string
  country: string
}

export interface OrderLine {
  bookId: string
  title: string
  author: string
  priceCents: number
  quantity: number
  lineTotalCents: number
}

export interface Order extends CheckoutDetails {
  id: string
  placedAt: string
  lines: OrderLine[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
}

function createOrderId(): string {
  const date = new Date()
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const sequence = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  return `SHELF-${ymd}-${sequence}`
}

export const useCheckoutStore = defineStore('checkout', () => {
  const cart = useCartStore()

  const lastOrder = ref<Order | null>(null)

  function placeOrder(details: CheckoutDetails): Order | null {
    if (cart.lineCount === 0) return null

    const order: Order = {
      id: createOrderId(),
      placedAt: new Date().toISOString(),
      ...details,
      lines: cart.entries.map((line) => ({
        bookId: line.book.id,
        title: line.book.title,
        author: line.book.author,
        priceCents: line.book.priceCents,
        quantity: line.quantity,
        lineTotalCents: line.lineTotalCents,
      })),
      subtotalCents: cart.subtotalCents,
      shippingCents: cart.shippingCents,
      totalCents: cart.totalCents,
    }

    cart.clear()
    lastOrder.value = order
    return order
  }

  function clearOrder() {
    lastOrder.value = null
  }

  return {
    lastOrder,
    placeOrder,
    clearOrder,
  }
})