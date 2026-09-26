import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '@/modules/cart/stores/cart.store'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'
import { CART_STORAGE_KEY } from '@/modules/cart/stores/cart.store'
import {
  FLAT_SHIPPING_CENTS,
  SHIPPING_FREE_THRESHOLD_CENTS,
} from '@/modules/cart/utils/money'

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('starts empty', () => {
    const cart = useCartStore()
    expect(cart.lineCount).toBe(0)
    expect(cart.count).toBe(0)
    expect(cart.subtotalCents).toBe(0)
    expect(cart.totalCents).toBe(0)
  })

  it('adds a book and persists it', () => {
    const cart = useCartStore()
    const book = useCatalogStore().books[0]

    cart.addBook(book.id)

    expect(cart.lineCount).toBe(1)
    expect(cart.count).toBe(1)
    expect(cart.quantityFor(book.id)).toBe(1)
    expect(cart.isInCart(book.id)).toBe(true)
    expect(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY)!)).toEqual([
      { bookId: book.id, quantity: 1 },
    ])
  })

  it('increments quantity when the same book is added again', () => {
    const cart = useCartStore()
    const book = useCatalogStore().books[0]

    cart.addBook(book.id)
    cart.addBook(book.id)

    expect(cart.lineCount).toBe(1)
    expect(cart.count).toBe(2)
    expect(cart.quantityFor(book.id)).toBe(2)
  })

  it('computes subtotal, shipping and total', () => {
    const cart = useCartStore()
    const [first, second] = useCatalogStore().books

    cart.addBook(first.id, 2)
    cart.addBook(second.id)

    const expectedSubtotal = first.priceCents * 2 + second.priceCents
    const expectedShipping =
      expectedSubtotal >= SHIPPING_FREE_THRESHOLD_CENTS
        ? 0
        : FLAT_SHIPPING_CENTS
    expect(cart.subtotalCents).toBe(expectedSubtotal)
    expect(cart.shippingCents).toBe(expectedShipping)
    expect(cart.totalCents).toBe(expectedSubtotal + expectedShipping)
  })

  it('waives shipping above the free-shipping threshold', () => {
    const cart = useCartStore()
    const books = useCatalogStore().books
    const expensive = [...books].sort((a, b) => b.priceCents - a.priceCents)[0]

    cart.addBook(expensive.id, 20)

    expect(cart.subtotalCents).toBeGreaterThanOrEqual(3500)
    expect(cart.shippingCents).toBe(0)
    expect(cart.totalCents).toBe(cart.subtotalCents)
  })

  it('sets, clamps and removes a quantity', () => {
    const cart = useCartStore()
    const book = useCatalogStore().books[0]

    cart.addBook(book.id)
    cart.setQuantity(book.id, 5)
    expect(cart.quantityFor(book.id)).toBe(5)

    cart.setQuantity(book.id, 0)
    expect(cart.isInCart(book.id)).toBe(false)

    cart.addBook(book.id)
    cart.removeBook(book.id)
    expect(cart.isInCart(book.id)).toBe(false)
    expect(cart.lineCount).toBe(0)
  })

  it('restores persisted items on creation', () => {
    const book = useCatalogStore().books[0]
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ bookId: book.id, quantity: 3 }]),
    )

    const cart = useCartStore()
    expect(cart.count).toBe(3)
    expect(cart.quantityFor(book.id)).toBe(3)
  })

  it('drops persisted lines with unknown book ids', () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ bookId: 'missing-id', quantity: 1 }]),
    )

    const cart = useCartStore()
    expect(cart.entries).toHaveLength(0)
    expect(cart.subtotalCents).toBe(0)
  })

  it('clears the cart', () => {
    const cart = useCartStore()
    const book = useCatalogStore().books[0]

    cart.addBook(book.id)
    cart.clear()

    expect(cart.lineCount).toBe(0)
    expect(cart.count).toBe(0)
    expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe('[]')
  })
})
