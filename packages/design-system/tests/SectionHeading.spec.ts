import { mount } from '@vue/test-utils'
import SectionHeading from '../src/ui/atoms/SectionHeading.vue'

describe('SectionHeading', () => {
  it('renders an h2 by default with its slot content', () => {
    const wrapper = mount(SectionHeading, { slots: { default: 'Explore' } })
    const heading = wrapper.get('h2')
    expect(heading.text()).toBe('Explore')
  })

  it('respects the level prop', () => {
    const wrapper = mount(SectionHeading, {
      props: { level: 'h1' },
      slots: { default: 'Your Cart' },
    })
    expect(wrapper.get('h1').text()).toBe('Your Cart')
  })

  it('sets the size via the size prop', async () => {
    const wrapper = mount(SectionHeading, {
      props: { size: '2xl' },
      slots: { default: 'Related books' },
    })
    const base = stylexClassNames(wrapper.get('h2'))
    await wrapper.setProps({ size: '3xl' })
    expect(base).not.toBe(stylexClassNames(wrapper.get('h2')))
  })

  it('passes through an id', () => {
    const wrapper = mount(SectionHeading, {
      props: { id: 'catalog-results' },
      slots: { default: 'Results' },
    })
    expect(wrapper.get('h2').attributes('id')).toBe('catalog-results')
  })
})

function stylexClassNames(element: {
  attributes: (name: string) => string | undefined
}) {
  return element.attributes('class') ?? ''
}
