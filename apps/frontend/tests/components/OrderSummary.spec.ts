import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import OrderSummary from '@/modules/cart/components/OrderSummary.vue'
import { useCartStore } from '@/modules/cart/stores/cart.store'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'
import { formatCurrency } from '@/modules/core'

function mountSummary(pinia: Pinia) {
  return mount(OrderSummary, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('OrderSummary', () => {
  it('shows an item count and totals for an empty cart', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mountSummary(pinia)

    expect(wrapper.text()).toContain('Order Summary')
    expect(wrapper.text()).toContain('0 items')
    expect(wrapper.text()).toContain('Subtotal')
    expect(wrapper.text()).toContain('Shipping')
    expect(wrapper.text()).toContain('Total')
  })

  it('lists every line item with its quantity and line total', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const books = useCatalogStore().books
    const cart = useCartStore()
    cart.addBook(books[0].id, 2)
    cart.addBook(books[1].id, 1)

    const wrapper = mountSummary(pinia)

    expect(wrapper.text()).toContain('3 items')
    expect(wrapper.text()).toContain(books[0].title)
    expect(wrapper.text()).toContain('× 2')
    expect(wrapper.text()).toContain(books[1].title)
    expect(wrapper.text()).toContain('× 1')
  })

  it('reflects totals from the cart store', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const book = useCatalogStore().books[0]
    const cart = useCartStore()
    cart.addBook(book.id, 3)

    const wrapper = mountSummary(pinia)

    expect(wrapper.text()).toContain(formatCurrency(book.priceCents * 3))
  })
})
