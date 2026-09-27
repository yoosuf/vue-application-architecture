import { mount } from '@vue/test-utils'
import IconButton from '../src/ui/atoms/IconButton.vue'

describe('IconButton', () => {
  it('labels itself for assistive tech', () => {
    const wrapper = mount(IconButton, { props: { label: 'Add to favorites' } })
    expect(wrapper.get('button').attributes('aria-label')).toBe(
      'Add to favorites',
    )
  })

  it('exposes the pressed state', () => {
    const wrapper = mount(IconButton, { props: { label: 'x', pressed: true } })
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('omits aria-pressed when it is not a toggle', () => {
    const wrapper = mount(IconButton, { props: { label: 'x' } })
    expect(wrapper.get('button').attributes('aria-pressed')).toBeUndefined()
  })

  it('exposes the unpressed state', () => {
    const wrapper = mount(IconButton, { props: { label: 'x', pressed: false } })
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')
  })

  it('disables the button', () => {
    const wrapper = mount(IconButton, { props: { label: 'x', disabled: true } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('emits click when pressed', async () => {
    const wrapper = mount(IconButton, { props: { label: 'x' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
