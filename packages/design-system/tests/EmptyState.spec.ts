import { mount } from '@vue/test-utils'
import EmptyState from '../src/ui/molecules/EmptyState.vue'

describe('EmptyState', () => {
  it('renders the title as an h2 by default', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Nothing here', message: 'Try again later' },
    })
    const heading = wrapper.get('h2')
    expect(heading.text()).toBe('Nothing here')
  })

  it('respects the heading level prop', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Nothing here',
        message: 'Try again later',
        headingLevel: 'h1',
      },
    })
    expect(wrapper.get('h1').text()).toBe('Nothing here')
  })

  it('renders the message', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Nothing here', message: 'Try again later' },
    })
    expect(wrapper.text()).toContain('Try again later')
  })

  it('renders the action slot', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Nothing here', message: 'Try again later' },
      slots: { default: 'Search again' },
    })
    expect(wrapper.text()).toContain('Search again')
  })
})
