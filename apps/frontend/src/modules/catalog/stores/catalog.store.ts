import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { books as generatedBooks } from '../mocks/books'
import type {
  Book,
  BookCategory,
} from '@vue-application-architecture/types/book'

export const ALL_CATEGORIES = 'All'

export type CategoryFilter = BookCategory | typeof ALL_CATEGORIES

export type SortOrder =
  'featured' | 'rating' | 'price-asc' | 'price-desc' | 'title'

export const useCatalogStore = defineStore('catalog', () => {
  const books = ref<Book[]>(generatedBooks)

  const searchQuery = ref('')
  const selectedCategory = ref<CategoryFilter>(ALL_CATEGORIES)
  const sortOrder = ref<SortOrder>('featured')

  const featuredBook = computed(() => books.value.find((book) => book.featured))

  const categories = computed<CategoryFilter[]>(() => [
    ALL_CATEGORIES,
    ...new Set(books.value.map((book) => book.category)),
  ])

  const filteredBooks = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return books.value.filter((book) => {
      const matchesCategory =
        selectedCategory.value === ALL_CATEGORIES ||
        book.category === selectedCategory.value

      const matchesQuery =
        query.length === 0 ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)

      return matchesCategory && matchesQuery
    })
  })

  const sortedBooks = computed(() => {
    const list = filteredBooks.value
    switch (sortOrder.value) {
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      case 'price-asc':
        return [...list].sort((a, b) => a.priceCents - b.priceCents)
      case 'price-desc':
        return [...list].sort((a, b) => b.priceCents - a.priceCents)
      case 'title':
        return [...list].sort((a, b) => a.title.localeCompare(b.title))
      default:
        return list
    }
  })

  function setSearchQuery(value: string) {
    searchQuery.value = value
  }

  function setCategory(category: CategoryFilter) {
    selectedCategory.value = category
  }

  function setSortOrder(order: SortOrder) {
    sortOrder.value = order
  }

  function findBookById(id: string): Book | undefined {
    return books.value.find((book) => book.id === id)
  }

  function relatedBooks(bookId: string, count = 4): Book[] {
    const book = books.value.find((candidate) => candidate.id === bookId)
    if (!book) return []

    const sameCategory = books.value.filter(
      (candidate) =>
        candidate.id !== book.id && candidate.category === book.category,
    )
    const otherCategories = books.value.filter(
      (candidate) =>
        candidate.id !== book.id && candidate.category !== book.category,
    )

    const byRating = (a: Book, b: Book) => b.rating - a.rating
    return [
      ...sameCategory.sort(byRating),
      ...otherCategories.sort(byRating),
    ].slice(0, count)
  }

  return {
    books,
    searchQuery,
    selectedCategory,
    sortOrder,
    featuredBook,
    categories,
    filteredBooks,
    sortedBooks,
    setSearchQuery,
    setCategory,
    setSortOrder,
    findBookById,
    relatedBooks,
  }
})
