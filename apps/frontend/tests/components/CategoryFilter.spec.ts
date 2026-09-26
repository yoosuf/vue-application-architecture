import { mount } from '@vue/test-utils'
import CategoryFilter from '@/modules/catalog/components/CategoryFilter.vue'
import { ALL_CATEGORIES } from '@/modules/catalog/stores/catalog.store'
import type { CategoryFilter as CategoryFilterValue } from '@/modules/catalog/stores/catalog.store'

const makeProps = (modelValue: CategoryFilterValue = ALL_CATEGORIES) => ({
  modelValue,
  categories: [ALL_CATEGORIES, 'Fiction', 'Design'] as CategoryFilterValue[],
})

describe('CategoryFilter', () => {
  it('renders one chip per category with the value first', () => {
    const wrapper = mount(CategoryFilter, { props: makeProps() })
    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      ALL_CATEGORIES,
      'Fiction',
      'Design',
    ])
  })

  it('marks the selected category as pressed', () => {
    const wrapper = mount(CategoryFilter, {
      props: makeProps('Fiction'),
    })
    const fiction = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Fiction')!
    expect(fiction.attributes('aria-pressed')).toBe('true')
  })

  it('emits update:modelValue when a chip is clicked', async () => {
    const wrapper = mount(CategoryFilter, { props: makeProps() })
    const fiction = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Fiction')!
    await fiction.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Fiction']])
  })
})
