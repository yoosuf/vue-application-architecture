import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '@/app/App.vue'
import { appRoutes } from '@/app/router'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'

async function mountApp() {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: appRoutes,
  })

  const wrapper = mount(App, {
    global: {
      plugins: [pinia, router],
    },
  })

  await router.isReady()
  await flushPromises()

  return { wrapper, router }
}

describe('router', () => {
  it('renders the Explore page at "/" with featured book and heading', async () => {
    const { wrapper } = await mountApp()
    const catalog = useCatalogStore()

    const headings = wrapper.findAll('h2').map((heading) => heading.text())

    expect(headings).toContain('Explore Books')
    expect(wrapper.get('h1#featured-title').text()).toBe(
      catalog.featuredBook!.title,
    )
  })

  it('renders the empty favorites state at "/favorites"', async () => {
    const { wrapper, router } = await mountApp()

    await router.push('/favorites')

    expect(wrapper.get('h1').text()).toBe('Your shelf is empty.')
    expect(wrapper.text()).toContain(
      'Explore books and save the ones you want to revisit.',
    )
  })

  it('renders the book details at "/books/:id"', async () => {
    const { wrapper, router } = await mountApp()
    const catalog = useCatalogStore()
    const book = catalog.books[0]

    await router.push(`/books/${book.id}`)

    expect(wrapper.get('h1').text()).toBe(book.title)
    expect(wrapper.text()).toContain(`Published ${book.year}`)
    expect(wrapper.text()).toContain(book.description)
    expect(wrapper.get('#related-books-title').text()).toBe('Related books')
    expect(wrapper.get('#related-books-title').element.tagName).toBe('H2')
  })

  it('routes from a book card to its details page', async () => {
    const { wrapper, router } = await mountApp()
    const catalog = useCatalogStore()
    const book = catalog.books[1]

    const cardLink = wrapper.find(
      `a[aria-label="${book.title} by ${book.author}"]`,
    )
    expect(cardLink.exists()).toBe(true)

    await cardLink.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('book-details')
    expect(router.currentRoute.value.params.id).toBe(book.id)
    expect(wrapper.get('h1').text()).toBe(book.title)
  })

  it('renders the not-found page for unknown routes', async () => {
    const { wrapper, router } = await mountApp()

    await router.push('/no/such/page')

    expect(wrapper.text()).toContain('Page not found')
  })
})
