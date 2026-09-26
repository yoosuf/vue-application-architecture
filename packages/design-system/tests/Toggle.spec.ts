import { mount } from '@vue/test-utils'
import Toggle from '../src/ui/atoms/Toggle.vue'

describe('Toggle', () => {
  it('renders a switch with the given label', () => {
    const wrapper = mount(Toggle, {
      props: { label: 'Order status', checked: true },
    })

    const button = wrapper.get('button')
    expect(button.attributes('role')).toBe('switch')
    expect(button.attributes('aria-checked')).toBe('true')
    expect(button.attributes('aria-label')).toBe('Order status')
    expect(button.text()).toContain('Order status')
  })

  it('reflects the unchecked state', () => {
    const wrapper = mount(Toggle, { props: { label: 'News', checked: false } })
    expect(wrapper.get('button').attributes('aria-checked')).toBe('false')
  })

  it('emits update:checked when clicked', async () => {
    const wrapper = mount(Toggle, {
      props: { label: 'News', checked: false },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:checked')).toEqual([[true]])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(Toggle, {
      props: { label: 'News', checked: false, disabled: true },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:checked')).toBeUndefined()
  })
})
