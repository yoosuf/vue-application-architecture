import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { defineComponent, nextTick } from 'vue'
import CartDrawer from '@/modules/cart/components/CartDrawer.vue'
import { useCartStore } from '@/modules/cart/stores/cart.store'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'

const DummyView = defineComponent({ template: '<p>dummy</p>' })

function routerFor() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'explore', component: DummyView },
      { path: '/products/:id', name: 'book-details', component: DummyView },
      { path: '/cart', name: 'cart', component: DummyView },
      { path: '/checkout', name: 'checkout', component: DummyView },
    ],
  })
}

async function mountDrawer(pinia: Pinia, router: ReturnType<typeof routerFor>) {
  const wrapper = mount(CartDrawer, {
    global: {
      plugins: [pinia, router],
    },
  })
  await router.isReady()
  return wrapper
}

describe('CartDrawer', () => {
  it('shows the empty state when the cart has no items', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const cart = useCartStore()
    cart.openCart()

    const wrapper = await mountDrawer(pinia, routerFor())

    expect(wrapper.get('[role="dialog"]').attributes('aria-hidden')).toBe(
      'false',
    )
    expect(wrapper.text()).toContain('Your cart is empty.')
    expect(wrapper.text()).toContain('Browse Books')
  })

  it('lists cart lines with totals when items exist', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const book = useCatalogStore().books[0]
    const cart = useCartStore()
    cart.addBook(book.id, 2)
    cart.openCart()

    const wrapper = await mountDrawer(pinia, routerFor())

    expect(wrapper.text()).toContain(book.title)
    expect(wrapper.text()).toContain('Subtotal')
    expect(wrapper.text()).toContain('Checkout')
    expect(wrapper.text()).toContain('View Cart')
    expect(wrapper.text()).toContain('Explore more books')
  })

  it('shows the footer actions as soon as an item is added to an empty cart', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const book = useCatalogStore().books[0]
    const cart = useCartStore()
    cart.openCart()

    const wrapper = await mountDrawer(pinia, routerFor())
    expect(wrapper.find('footer').exists()).toBe(false)

    cart.addBook(book.id)
    await nextTick()

    const footer = wrapper.get('footer')
    expect(footer.text()).toContain('Subtotal')
    expect(footer.text()).toContain('Checkout')
    expect(footer.text()).toContain('View Cart')
    expect(footer.text()).toContain('Explore more books')

    cart.removeBook(book.id)
    await nextTick()
    expect(wrapper.find('footer').exists()).toBe(false)
  })

  it('closes the drawer and keeps browsing from the explore action', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const book = useCatalogStore().books[0]
    const cart = useCartStore()
    cart.addBook(book.id)
    cart.openCart()

    const router = routerFor()
    const wrapper = await mountDrawer(pinia, router)

    const explore = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Explore more books'))
    expect(explore).toBeDefined()
    await explore!.trigger('click')
    await flushPromises()

    expect(cart.isCartOpen).toBe(false)
    expect(router.currentRoute.value.name).toBe('explore')
    wrapper.unmount()
  })

  it('closes the drawer and goes to checkout when Checkout is clicked', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const book = useCatalogStore().books[0]
    const cart = useCartStore()
    cart.addBook(book.id)
    cart.openCart()

    const router = routerFor()
    const wrapper = await mountDrawer(pinia, router)

    const checkout = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Checkout'))
    expect(checkout).toBeDefined()
    await checkout!.trigger('click')
    await flushPromises()

    expect(cart.isCartOpen).toBe(false)
    expect(router.currentRoute.value.name).toBe('checkout')
    wrapper.unmount()
  })
})
