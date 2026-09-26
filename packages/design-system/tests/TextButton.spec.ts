import { mount } from '@vue/test-utils'
import TextButton from '../src/ui/atoms/TextButton.vue'

describe('TextButton', () => {
  it('renders a button with its slot content', () => {
    const wrapper = mount(TextButton, {
      slots: { default: 'Resend' },
    })

    const button = wrapper.get('button')
    expect(button.text()).toBe('Resend')
    expect(button.attributes('type')).toBe('button')
  })

  it('emits click on activation', async () => {
    const wrapper = mount(TextButton)
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('supports submit type and disabled state', async () => {
    const wrapper = mount(TextButton, {
      props: { type: 'submit', disabled: true },
    })

    const button = wrapper.get('button')
    expect(button.attributes('type')).toBe('submit')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
