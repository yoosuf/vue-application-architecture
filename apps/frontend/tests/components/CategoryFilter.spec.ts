import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CategoryFilter from '@/modules/catalog/components/CategoryFilter.vue'
import {
  ALL_CATEGORIES,
  useCatalogStore,
} from '@/modules/catalog/stores/catalog.store'

describe('CategoryFilter', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders one chip per category with "All" first', () => {
    const wrapper = mount(CategoryFilter)
    const catalog = useCatalogStore()

    const labels = wrapper.findAll('button').map((button) => button.text())

    expect(labels).toEqual(catalog.categories)
    expect(labels[0]).toBe(ALL_CATEGORIES)
  })

  it('marks the initially selected category as pressed', () => {
    const wrapper = mount(CategoryFilter)
    const first = wrapper.get('button')
    expect(first.attributes('aria-pressed')).toBe('true')
  })

  it('updates the selected category when a chip is clicked', async () => {
    const wrapper = mount(CategoryFilter)
    const catalog = useCatalogStore()

    const fiction = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Fiction')

    expect(fiction).toBeTruthy()
    await fiction!.trigger('click')

    expect(catalog.selectedCategory).toBe('Fiction')
    expect(fiction!.attributes('aria-pressed')).toBe('true')

    const all = wrapper
      .findAll('button')
      .find((button) => button.text() === ALL_CATEGORIES)
    expect(all!.attributes('aria-pressed')).toBe('false')
  })
})
