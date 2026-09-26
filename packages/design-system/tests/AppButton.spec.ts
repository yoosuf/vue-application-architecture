import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import AppButton from '../src/ui/atoms/AppButton.vue'

const RouterLinkStub = defineComponent({
  props: ['to', 'ariaDisabled'],
  render() {
    return h(
      'a',
      { 'aria-disabled': this.ariaDisabled },
      this.$slots.default?.(),
    )
  },
})

describe('AppButton', () => {
  it('renders a button with its slot content by default', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Browse' } })
    const button = wrapper.get('button')
    expect(button.text()).toBe('Browse')
  })

  it('applies the native type prop', () => {
    const wrapper = mount(AppButton, { props: { type: 'submit' } })
    expect(wrapper.get('button').attributes('type')).toBe('submit')
  })

  it('disables the button', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('renders a RouterLink when given a target route', () => {
    const wrapper = mount(AppButton, {
      props: { to: { name: 'catalog' } },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('marks a RouterLink as disabled with aria-disabled', () => {
    const wrapper = mount(AppButton, {
      props: { to: { name: 'catalog' }, disabled: true },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.get('a').attributes('aria-disabled')).toBe('true')
  })

  it('emits click when pressed', async () => {
    const wrapper = mount(AppButton, { slots: { default: 'Go' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
