import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useCatalogStore } from '../../catalog'
import { FLAT_SHIPPING_CENTS, SHIPPING_FREE_THRESHOLD_CENTS } from '../utils/money'
import type { Book } from '@vue-application-architecture/types/book'

export interface CartItem {
  bookId: string
  quantity: number
}

export interface CartLine {
  book: Book
  quantity: number
  lineTotalCents: number
}

export const CART_STORAGE_KEY = 'shelf:cart'

function readStoredItems(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((entry) => {
      if (typeof entry !== 'object' || entry === null) return []
      const { bookId, quantity } = entry as {
        bookId?: unknown
        quantity?: unknown
      }
      if (
        typeof bookId !== 'string' ||
        typeof quantity !== 'number' ||
        !Number.isFinite(quantity)
      ) {
        return []
      }
      return [{ bookId, quantity: Math.max(1, Math.floor(quantity)) }]
    })
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const catalog = useCatalogStore()

  const items = ref<CartItem[]>(readStoredItems())

  const entries = computed<CartLine[]>(() =>
    items.value.flatMap((item) => {
      const book = catalog.books.find(
        (candidate) => candidate.id === item.bookId,
      )
      if (!book) return []
      return [
        {
          book,
          quantity: item.quantity,
          lineTotalCents: book.priceCents * item.quantity,
        },
      ]
    }),
  )

  const lineCount = computed(() => items.value.length)

  const count = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  )

  const subtotalCents = computed(() =>
    entries.value.reduce((total, line) => total + line.lineTotalCents, 0),
  )

  const shippingCents = computed(() => {
    if (
      subtotalCents.value === 0 ||
      subtotalCents.value >= SHIPPING_FREE_THRESHOLD_CENTS
    ) {
      return 0
    }
    return FLAT_SHIPPING_CENTS
  })

  const totalCents = computed(
    () => subtotalCents.value + shippingCents.value,
  )

  function persist() {
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items.value),
      )
    } catch {
      // Storage may be unavailable (private mode, quota). Best effort only.
    }
  }

  function quantityFor(bookId: string): number {
    return items.value.find((item) => item.bookId === bookId)?.quantity ?? 0
  }

  function isInCart(bookId: string): boolean {
    return items.value.some((item) => item.bookId === bookId)
  }

  function addBook(bookId: string, quantity = 1) {
    const existing = items.value.find((item) => item.bookId === bookId)
    if (existing) {
      existing.quantity += Math.max(1, quantity)
    } else {
      items.value.push({ bookId, quantity: Math.max(1, quantity) })
    }
    persist()
  }

  function setQuantity(bookId: string, quantity: number) {
    if (quantity <= 0) {
      removeBook(bookId)
      return
    }
    const existing = items.value.find((item) => item.bookId === bookId)
    if (existing) {
      existing.quantity = Math.max(1, Math.floor(quantity))
      persist()
    }
  }

  function removeBook(bookId: string) {
    items.value = items.value.filter((item) => item.bookId !== bookId)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return {
    items,
    entries,
    lineCount,
    count,
    subtotalCents,
    shippingCents,
    totalCents,
    quantityFor,
    isInCart,
    addBook,
    setQuantity,
    removeBook,
    clear,
  }
})