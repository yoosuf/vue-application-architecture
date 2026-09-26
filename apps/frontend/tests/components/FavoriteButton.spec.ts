import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FavoriteButton from '@/modules/favorites/components/FavoriteButton.vue'
import { useFavoritesStore } from '@/modules/favorites/stores/favorites.store'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'
import type { Book } from '@vue-application-architecture/types/book'

describe('FavoriteButton', () => {
  let book: Book

  beforeEach(() => {
    setActivePinia(createPinia())
    book = useCatalogStore().books[0]
  })

  function mountButton() {
    return mount(FavoriteButton, {
      props: { book },
    })
  }

  it('labels itself as "Add" when the book is not a favorite', () => {
    const button = mountButton().get('button')
    expect(button.attributes('aria-label')).toBe(
      `Add ${book.title} to favorites`,
    )
    expect(button.attributes('aria-pressed')).toBe('false')
  })

  it('adds the book to favorites when clicked', async () => {
    const wrapper = mountButton()
    await wrapper.get('button').trigger('click')

    const favorites = useFavoritesStore()
    expect(favorites.isFavorite(book.id)).toBe(true)
    expect(wrapper.get('button').attributes('aria-label')).toBe(
      `Remove ${book.title} from favorites`,
    )
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('removes the book when clicked again', async () => {
    const favorites = useFavoritesStore()
    favorites.addFavorite(book.id)

    const wrapper = mountButton()
    await wrapper.get('button').trigger('click')

    expect(favorites.isFavorite(book.id)).toBe(false)
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')
  })
})
