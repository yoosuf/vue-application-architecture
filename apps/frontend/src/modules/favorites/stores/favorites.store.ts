import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useCatalogStore } from '../../catalog'

const STORAGE_KEY = 'shelf:favorites'

function readStoredIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.filter((value) => typeof value === 'string'))]
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const catalog = useCatalogStore()

  const favoriteIds = ref<string[]>(readStoredIds())

  const favoriteBooks = computed(() =>
    catalog.books.filter((book) => favoriteIds.value.includes(book.id)),
  )

  const count = computed(() => favoriteIds.value.length)

  function persist() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(favoriteIds.value),
      )
    } catch {
      // Storage may be unavailable (private mode, quota). Best effort only.
    }
  }

  function isFavorite(id: string): boolean {
    return favoriteIds.value.includes(id)
  }

  function addFavorite(id: string) {
    if (!isFavorite(id)) {
      favoriteIds.value.push(id)
      persist()
    }
  }

  function removeFavorite(id: string) {
    if (isFavorite(id)) {
      favoriteIds.value = favoriteIds.value.filter(
        (favoriteId) => favoriteId !== id,
      )
      persist()
    }
  }

  function toggleFavorite(id: string) {
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  return {
    favoriteIds,
    favoriteBooks,
    count,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
})
