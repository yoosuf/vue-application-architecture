import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '@/modules/favorites/stores/favorites.store'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'

describe('favorites store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    const favorites = useFavoritesStore()
    expect(favorites.count).toBe(0)
    expect(favorites.favoriteBooks).toHaveLength(0)
  })

  it('adds and removes favorites', () => {
    const favorites = useFavoritesStore()
    const catalog = useCatalogStore()
    const book = catalog.books[0]

    favorites.addFavorite(book.id)
    expect(favorites.isFavorite(book.id)).toBe(true)
    expect(favorites.count).toBe(1)
    expect(favorites.favoriteBooks).toEqual([book])

    favorites.removeFavorite(book.id)
    expect(favorites.isFavorite(book.id)).toBe(false)
    expect(favorites.count).toBe(0)
  })

  it('does not add the same book twice', () => {
    const favorites = useFavoritesStore()
    const catalog = useCatalogStore()
    const book = catalog.books[0]

    favorites.addFavorite(book.id)
    favorites.addFavorite(book.id)

    expect(favorites.count).toBe(1)
  })

  it('toggles favorites on and off', () => {
    const favorites = useFavoritesStore()
    const catalog = useCatalogStore()
    const book = catalog.books[2]

    favorites.toggleFavorite(book.id)
    expect(favorites.isFavorite(book.id)).toBe(true)

    favorites.toggleFavorite(book.id)
    expect(favorites.isFavorite(book.id)).toBe(false)
  })

  it('persists favorites to localStorage', () => {
    const favorites = useFavoritesStore()
    const catalog = useCatalogStore()
    const book = catalog.books[0]

    favorites.addFavorite(book.id)

    expect(window.localStorage.getItem('shelf:favorites')).toBe(
      JSON.stringify([book.id]),
    )
  })

  it('rehydrates favorites from localStorage', () => {
    const catalog = useCatalogStore()
    const first = useFavoritesStore()
    const book = catalog.books[0]
    first.addFavorite(book.id)

    setActivePinia(createPinia())
    const reloaded = useFavoritesStore()

    expect(reloaded.isFavorite(book.id)).toBe(true)
    expect(reloaded.favoriteBooks).toContainEqual(book)
  })

  it('ignores corrupted storage and dedupes ids', () => {
    window.localStorage.setItem(
      'shelf:favorites',
      JSON.stringify(['a', 'a', 42, {}]),
    )

    const favorites = useFavoritesStore()
    expect(favorites.favoriteIds).toEqual(['a'])
  })

  it('ignores non-array storage values', () => {
    window.localStorage.setItem('shelf:favorites', 'garbage')

    const favorites = useFavoritesStore()
    expect(favorites.favoriteIds).toEqual([])
  })
})
