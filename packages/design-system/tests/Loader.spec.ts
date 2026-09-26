import { mount } from '@vue/test-utils'
import Loader from '../src/ui/atoms/Loader.vue'

describe('Loader', () => {
  it('announces its label through a status region', () => {
    const wrapper = mount(Loader, { props: { label: 'Loading page' } })
    const region = wrapper.get('[role="status"]')
    expect(region.text()).toContain('Loading page')
  })

  it('hides the spinner icon from assistive tech', () => {
    const wrapper = mount(Loader)
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it('applies a custom size to the icon', () => {
    const wrapper = mount(Loader, { props: { size: 32 } })
    expect(wrapper.get('svg').attributes('width')).toBe('32')
  })
})
