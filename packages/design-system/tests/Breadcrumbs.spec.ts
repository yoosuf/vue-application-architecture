import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent } from 'vue'
import Breadcrumbs from '../src/ui/molecules/Breadcrumbs.vue'

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

const items = [
  { label: 'Home', to: { name: 'home' } },
  { label: 'Books', to: { name: 'books' } },
  { label: 'Current' },
]

describe('Breadcrumbs', () => {
  it('renders a labeled navigation with ordered items', async () => {
    const router = routerFor()
    const wrapper = mount(Breadcrumbs, {
      props: { items },
      global: { plugins: [router] },
    })
    await router.isReady()

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Breadcrumbs')
    expect(wrapper.findAll('ol > li')).toHaveLength(3)
  })

  it('links every item with a route and labels the trailing item current', async () => {
    const router = routerFor()
    const wrapper = mount(Breadcrumbs, {
      props: { items },
      global: { plugins: [router] },
    })
    await router.isReady()

    const links = wrapper.findAll('a')
    expect(links.map((link) => link.text())).toEqual(['Home', 'Books'])
    expect(links.map((link) => link.attributes('href'))).toEqual([
      '/',
      '/books',
    ])

    const current = wrapper.get('ol > li:last-child span[aria-current="page"]')
    expect(current.text()).toBe('Current')
    expect(current.element.tagName).toBe('SPAN')
  })

  it('marks every item current when no route is provided', async () => {
    const router = routerFor()
    const wrapper = mount(Breadcrumbs, {
      props: { items: [{ label: 'Only' }] },
      global: { plugins: [router] },
    })
    await router.isReady()

    expect(wrapper.findAll('a')).toHaveLength(0)
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Only')
  })
})
