import { mount } from '@vue/test-utils'
import TextField from '../src/ui/atoms/TextField.vue'

describe('TextField', () => {
  it('renders a labelled input', () => {
    const wrapper = mount(TextField, {
      props: { modelValue: '', label: 'Email' },
    })
    const input = wrapper.get('input')
    expect(wrapper.get('label').text()).toBe('Email')
    expect(input.attributes('id')).toBe(
      wrapper.get('label').attributes('for'),
    )
  })

  it('marks required fields', () => {
    const wrapper = mount(TextField, {
      props: { modelValue: '', label: 'Email', required: true },
    })
    expect(wrapper.get('label').text()).toContain('*')
    expect(wrapper.get('input').attributes('required')).toBeDefined()
  })

  it('emits the typed value on input', async () => {
    const wrapper = mount(TextField, {
      props: { modelValue: '', label: 'Email' },
    })
    await wrapper.get('input').setValue('ada@example.com')
    expect(wrapper.emitted('update:modelValue')).toEqual([
      ['ada@example.com'],
    ])
  })

  it('shows an error message and marks the field invalid', () => {
    const wrapper = mount(TextField, {
      props: { modelValue: 'garbage', label: 'Email', error: 'Not an email' },
    })
    expect(wrapper.get('[role="alert"]').text()).toBe('Not an email')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input').attributes('aria-describedby')).toBeDefined()
  })

  it('shows a hint instead when there is no error', () => {
    const wrapper = mount(TextField, {
      props: { modelValue: '', label: 'ZIP', hint: 'US or Canada' },
    })
    expect(wrapper.text()).toContain('US or Canada')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})