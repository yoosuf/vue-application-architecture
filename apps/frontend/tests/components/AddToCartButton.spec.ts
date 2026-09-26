import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import AddToCartButton from '@/modules/cart/components/AddToCartButton.vue'
import { useCartStore } from '@/modules/cart/stores/cart.store'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'
import type { Book } from '@vue-application-architecture/types/book'

describe('AddToCartButton', () => {
  let book: Book

  beforeEach(() => {
    setActivePinia(createPinia())
    book = useCatalogStore().books[0]
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('offers to add a book that is not in the cart', () => {
    const wrapper = mount(AddToCartButton, { props: { book } })
    expect(wrapper.get('button').text()).toContain('Add to Cart')
  })

  it('adds the book to the cart and opens the cart drawer when clicked', async () => {
    const wrapper = mount(AddToCartButton, { props: { book } })

    await wrapper.get('button').trigger('click')

    const cart = useCartStore()
    expect(cart.isInCart(book.id)).toBe(true)
    expect(cart.quantityFor(book.id)).toBe(1)
    expect(cart.isCartOpen).toBe(true)
  })

  it('confirms the addition before turning into a stepper', async () => {
    const wrapper = mount(AddToCartButton, { props: { book } })

    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').text()).toContain('Added')

    vi.advanceTimersByTime(1200)
    await nextTick()
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('1')
  })

  it('turns into a quantity stepper once the book is in the cart', () => {
    const cart = useCartStore()
    cart.addBook(book.id, 2)

    const wrapper = mount(AddToCartButton, { props: { book } })

    expect(wrapper.text()).not.toContain('Add to Cart')
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('2')
  })

  it('updates the quantity from the stepper', async () => {
    const wrapper = mount(AddToCartButton, { props: { book } })
    await wrapper.get('button').trigger('click')

    vi.advanceTimersByTime(1200)
    await nextTick()

    await wrapper
      .get('button[aria-label*="Increase quantity"]')
      .trigger('click')

    expect(useCartStore().quantityFor(book.id)).toBe(2)
  })

  it('keeps the button visible in persistent mode next to a stepper', async () => {
    const cart = useCartStore()
    cart.addBook(book.id, 2)

    const wrapper = mount(AddToCartButton, {
      props: { book, persistent: true, block: true },
    })

    expect(wrapper.text()).toContain('Update Cart')
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('2')
  })

  it('shows "Update Cart" persistently while the quantity changes', async () => {
    const wrapper = mount(AddToCartButton, {
      props: { book, persistent: true },
    })
    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('Added')

    vi.advanceTimersByTime(1200)
    await nextTick()

    expect(wrapper.text()).toContain('Update Cart')

    await wrapper
      .get('button[aria-label*="Increase quantity"]')
      .trigger('click')

    expect(wrapper.text()).toContain('Update Cart')
    expect(useCartStore().quantityFor(book.id)).toBe(2)
  })
})
