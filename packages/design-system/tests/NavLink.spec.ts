import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent } from 'vue'
import NavLink from '../src/ui/atoms/NavLink.vue'

const Placeholder = defineComponent({ template: '<div />' })

function routerFor() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Placeholder },
      { path: '/books', name: 'books', component: Placeholder },
    ],
  })
}

async function mountNavLink(to: object) {
  const router = routerFor()
  const wrapper = mount(NavLink, {
    props: { to, label: 'Books' },
    global: { plugins: [router] },
  })
  await router.isReady()
  return { wrapper, router }
}

function linkOf(wrapper: VueWrapper) {
  return wrapper.get('a')
}

describe('NavLink', () => {
  it('renders an anchor with its label and href', async () => {
    const { wrapper } = await mountNavLink({ name: 'books' })
    const link = linkOf(wrapper)
    expect(link.text()).toBe('Books')
    expect(link.attributes('href')).toBe('/books')
  })

  it('is not marked active on a different route', async () => {
    const { wrapper } = await mountNavLink({ name: 'books' })
    expect(linkOf(wrapper).attributes('aria-current')).toBeUndefined()
  })

  it('marks aria-current="page" when active', async () => {
    const router = routerFor()
    const wrapper = mount(NavLink, {
      props: { to: { name: 'home' }, label: 'Home' },
      global: { plugins: [router] },
    })
    await router.isReady()
    expect(linkOf(wrapper).attributes('aria-current')).toBe('page')
  })

  it('navigates on click', async () => {
    const { wrapper, router } = await mountNavLink({ name: 'books' })
    await linkOf(wrapper).trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('books')
  })
})
