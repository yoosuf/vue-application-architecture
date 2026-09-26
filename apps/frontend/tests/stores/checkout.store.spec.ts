import { createPinia, setActivePinia } from 'pinia'
import { useCheckoutStore } from '@/modules/checkout/stores/checkout.store'
import { useCartStore } from '@/modules/cart/stores/cart.store'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'
import type { CheckoutDetails } from '@/modules/checkout/stores/checkout.store'

const details: CheckoutDetails = {
  email: 'ada@example.com',
  name: 'Ada Lovelace',
  addressLine1: '12 Analytical Engine Lane',
  addressLine2: '',
  city: 'London',
  zip: 'SW1A 1AA',
  country: 'United Kingdom',
}

describe('checkout store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('refuses to place an order with an empty cart', () => {
    const checkout = useCheckoutStore()
    expect(checkout.placeOrder(details)).toBeNull()
    expect(checkout.lastOrder).toBeNull()
  })

  it('snapshots the cart, clears it and records the order', () => {
    const cart = useCartStore()
    const checkout = useCheckoutStore()
    const [first, second] = useCatalogStore().books

    cart.addBook(first.id, 2)
    cart.addBook(second.id)

    const expectedSubtotal = cart.subtotalCents
    const expectedTotal = cart.totalCents
    const order = checkout.placeOrder(details)!

    expect(order.id).toMatch(/^SHELF-\d{8}-\d{6}$/)
    expect(order.lines).toHaveLength(2)
    expect(order.lines[0]).toMatchObject({
      bookId: first.id,
      title: first.title,
      quantity: 2,
      lineTotalCents: first.priceCents * 2,
    })
    expect(order.subtotalCents).toBe(expectedSubtotal)
    expect(order.totalCents).toBe(expectedTotal)
    expect(order.email).toBe('ada@example.com')

    expect(checkout.lastOrder).toEqual(order)
    expect(cart.lineCount).toBe(0)
  })

  it('keeps order totals stable after the cart is cleared', () => {
    const cart = useCartStore()
    const checkout = useCheckoutStore()
    const book = useCatalogStore().books[0]

    cart.addBook(book.id)
    const order = checkout.placeOrder(details)!

    expect(order.lines[0].lineTotalCents).toBe(book.priceCents)
    expect(order.totalCents).toBe(order.subtotalCents + order.shippingCents)
    expect(cart.count).toBe(0)
  })
})
