import { createPinia, setActivePinia } from 'pinia'
import {
  ALL_CATEGORIES,
  useCatalogStore,
} from '@/modules/catalog/stores/catalog.store'
import { BOOK_COUNT, books } from '@/modules/catalog/mocks/books'

describe('catalog store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes a deterministic catalog of BOOK_COUNT books', () => {
    const catalog = useCatalogStore()
    expect(catalog.books).toHaveLength(BOOK_COUNT)
    expect(catalog.books).toEqual(books)
  })

  it('features exactly one book', () => {
    const catalog = useCatalogStore()
    const featured = catalog.featuredBook
    expect(featured).toBeDefined()
    expect(featured?.featured).toBe(true)
    expect(catalog.books.filter((book) => book.featured)).toHaveLength(1)
  })

  it('lists all categories starting with "All"', () => {
    const catalog = useCatalogStore()
    const expected = [
      ALL_CATEGORIES,
      ...new Set(catalog.books.map((book) => book.category)),
    ]
    expect(catalog.categories).toEqual(expected)
    expect(catalog.categories[0]).toBe(ALL_CATEGORIES)
  })

  it('returns every book when nothing is filtered', () => {
    const catalog = useCatalogStore()
    expect(catalog.filteredBooks).toHaveLength(BOOK_COUNT)
  })

  it('filters books by title search term', () => {
    const catalog = useCatalogStore()
    const target = catalog.books[4]
    catalog.setSearchQuery(target.title.slice(0, 8))

    expect(catalog.filteredBooks).toContain(target)
    expect(catalog.filteredBooks).not.toHaveLength(BOOK_COUNT)
  })

  it('filtering is case-insensitive and trims whitespace', () => {
    const catalog = useCatalogStore()
    const target = catalog.books[0]
    catalog.books = [
      { ...target, title: 'A Distinctive Test Title' },
      { ...target, id: 'other-book', title: 'Another Book' },
    ]
    catalog.setSearchQuery('  A DISTINCTIVE TEST TITLE  ')

    expect(catalog.filteredBooks).toEqual([catalog.books[0]])
  })

  it('matches against author and category', () => {
    const catalog = useCatalogStore()
    const target = catalog.books[2]

    catalog.setSearchQuery(target.author.split(' ')[0])
    expect(catalog.filteredBooks).toContain(target)

    catalog.setSearchQuery(target.category.toLowerCase())
    expect(
      catalog.filteredBooks.every((b) => b.category === target.category),
    ).toBe(true)
  })

  it('returns no results for a term that matches nothing', () => {
    const catalog = useCatalogStore()
    catalog.setSearchQuery('zzz-no-such-book')
    expect(catalog.filteredBooks).toHaveLength(0)
  })

  it('filters by selected category', () => {
    const catalog = useCatalogStore()
    const category = catalog.books[0].category
    catalog.setCategory(category)

    expect(catalog.filteredBooks.every((b) => b.category === category)).toBe(
      true,
    )
  })

  it('combines category and search filters', () => {
    const catalog = useCatalogStore()
    const category = catalog.books[0].category
    catalog.setCategory(category)
    catalog.setSearchQuery('zzz-no-match')

    expect(catalog.filteredBooks).toHaveLength(0)
  })

  it('finds a book by id', () => {
    const catalog = useCatalogStore()
    const target = catalog.books[0]
    expect(catalog.findBookById(target.id)).toEqual(target)
    expect(catalog.findBookById('missing-id')).toBeUndefined()
  })

  it('returns related books from the same category first, excluding the book', () => {
    const catalog = useCatalogStore()
    const book = catalog.books[0]
    const sameCategory = catalog.books
      .filter(
        (candidate) =>
          candidate.id !== book.id && candidate.category === book.category,
      )
      .sort((a, b) => b.rating - a.rating)
    const related = catalog.relatedBooks(book.id, 4)

    expect(related).toHaveLength(4)
    expect(related).not.toContain(book)
    expect(related.slice(0, sameCategory.length).map((b) => b.id)).toEqual(
      sameCategory.slice(0, 4).map((b) => b.id),
    )
  })

  it('returns no related books for an unknown id', () => {
    const catalog = useCatalogStore()
    expect(catalog.relatedBooks('missing-id')).toEqual([])
  })

  it('keeps the featured order by default', () => {
    const catalog = useCatalogStore()
    expect(catalog.sortedBooks).toEqual(catalog.filteredBooks)
  })

  it('sorts by rating when requested', () => {
    const catalog = useCatalogStore()
    catalog.setSortOrder('rating')

    const ratings = catalog.sortedBooks.map((book) => book.rating)
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a))
  })

  it('sorts by price ascending and descending', () => {
    const catalog = useCatalogStore()
    catalog.setSortOrder('price-asc')
    const ascending = catalog.sortedBooks.map((book) => book.priceCents)
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b))

    catalog.setSortOrder('price-desc')
    const descending = catalog.sortedBooks.map((book) => book.priceCents)
    expect(descending).toEqual([...descending].sort((a, b) => b - a))
  })

  it('sorts books alphabetically by title', () => {
    const catalog = useCatalogStore()
    catalog.setSortOrder('title')

    const titles = catalog.sortedBooks.map((book) => book.title)
    expect(titles).toEqual([...titles].sort())
  })

  it('applies sorting after the active filters', () => {
    const catalog = useCatalogStore()
    const category = catalog.books[0].category
    catalog.setCategory(category)
    catalog.setSortOrder('price-asc')

    expect(
      catalog.sortedBooks.every((book) => book.category === category),
    ).toBe(true)
    const prices = catalog.sortedBooks.map((book) => book.priceCents)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })
})
