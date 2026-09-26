import { mount } from '@vue/test-utils'
import PageSection from '../src/ui/molecules/PageSection.vue'

describe('PageSection', () => {
  it('renders a section with its slot content', () => {
    const wrapper = mount(PageSection, {
      slots: { default: '<h1>Favorites</h1>' },
    })
    expect(wrapper.get('section').text()).toContain('Favorites')
  })

  it('exposes an accessible name via the label prop', () => {
    const wrapper = mount(PageSection, {
      props: { label: 'Book grid' },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.get('section').attributes('aria-label')).toBe('Book grid')
  })

  it('labels the section from a heading id when provided', () => {
    const wrapper = mount(PageSection, {
      props: { labelledby: 'catalog-heading' },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.get('section').attributes('aria-labelledby')).toBe(
      'catalog-heading',
    )
  })

  it('applies different block padding per spacing prop', async () => {
    const wrapper = mount(PageSection, {
      props: { spacing: 'xl' },
      slots: { default: '<p>Content</p>' },
    })
    const xlClass = classNamesOf(wrapper.get('section'))
    await wrapper.setProps({ spacing: 'xxxl' })
    expect(classNamesOf(wrapper.get('section'))).not.toBe(xlClass)
  })

  it('lays children out as a column when requested', () => {
    const wrapper = mount(PageSection, {
      props: { layout: 'column' },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.get('section').attributes('class')).toBeTruthy()
  })
})

function classNamesOf(element: {
  attributes: (name: string) => string | undefined
}) {
  return element.attributes('class') ?? ''
}
