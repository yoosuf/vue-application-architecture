import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { BookCard } from '@/modules/catalog'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'
import type { Book } from '@vue-application-architecture/types/book'

const RouterLinkStub = {
  props: ['to'],
  template: '<a v-bind="$attrs"><slot /></a>',
}

describe('BookCard', () => {
  let book: Book

  beforeEach(() => {
    setActivePinia(createPinia())
    book = useCatalogStore().books[0]
  })

  function mountCard() {
    return mount(BookCard, {
      props: { book },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })
  }

  it('renders the book title, author, category and year', () => {
    const wrapper = mountCard()
    expect(wrapper.get('h3').text()).toBe(book.title)
    expect(wrapper.find('p').text()).toBe(book.author)
    expect(wrapper.find('h3 + p + p').text()).toContain(book.category)
    expect(wrapper.find('h3 + p + p').text()).toContain(String(book.year))
  })

  it('renders the rating', () => {
    const wrapper = mountCard()
    const rating = wrapper.find('[aria-label*="out of 5"]')
    expect(rating.exists()).toBe(true)
    expect(rating.text()).toBe(book.rating.toFixed(1))
  })

  it('links to the book details route', () => {
    const wrapper = mountCard()
    const link = wrapper.getComponent(RouterLinkStub)
    expect(link.props('to')).toEqual({
      name: 'book-details',
      params: { id: book.id },
    })
    expect(link.attributes('aria-label')).toBe(
      `${book.title} by ${book.author}`,
    )
  })

  it('lazily loads covers for non-featured books', () => {
    book = useCatalogStore().books[1]
    const wrapper = mountCard()
    const img = wrapper.get('img')
    expect(img.attributes('loading')).toBe('lazy')
  })

  it('eagerly loads the featured book cover', () => {
    book = useCatalogStore().featuredBook ?? book
    const wrapper = mountCard()
    const img = wrapper.get('img')
    expect(img.attributes('loading')).toBe('eager')
  })

  it('renders footer action content when a footer slot is provided', () => {
    const wrapper = mount(BookCard, {
      props: { book },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
      slots: { footer: '<button class="shoe-cta">Add to Cart</button>' },
    })

    const cta = wrapper.get('button.shoe-cta')
    expect(cta.text()).toBe('Add to Cart')
  })

  it('shows rating and price without an action row when no footer slot is given', () => {
    const wrapper = mountCard()

    expect(wrapper.find('button.shoe-cta').exists()).toBe(false)
    expect(wrapper.find('[aria-label*="out of 5"]').exists()).toBe(true)
    expect(wrapper.get('[aria-label^="Price"]').text()).toContain(
      (book.priceCents / 100).toFixed(2),
    )
  })
})
