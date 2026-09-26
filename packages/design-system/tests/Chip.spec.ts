import { mount } from '@vue/test-utils'
import Chip from '../src/ui/atoms/Chip.vue'

describe('Chip', () => {
  it('renders a button with its label', () => {
    const wrapper = mount(Chip, { props: { label: 'Fantasy' } })
    expect(wrapper.get('button').text()).toBe('Fantasy')
    expect(wrapper.get('button').attributes('type')).toBe('button')
  })

  it('renders the labeled slot over the label prop', () => {
    const wrapper = mount(Chip, {
      props: { label: 'Fantasy' },
      slots: { default: 'Sci-Fi' },
    })
    expect(wrapper.get('button').text()).toBe('Sci-Fi')
  })

  it('marks the button as not pressed by default', () => {
    const wrapper = mount(Chip, { props: { label: 'Fantasy' } })
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')
  })

  it('marks the button as pressed when selected', () => {
    const wrapper = mount(Chip, {
      props: { label: 'Fantasy', selected: true },
    })
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('emits select when clicked', async () => {
    const wrapper = mount(Chip, { props: { label: 'Fantasy' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })
})
