import { mount } from '@vue/test-utils'
import NativeSelect from '../src/ui/atoms/NativeSelect.vue'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

describe('NativeSelect', () => {
  it('renders a labelled select with its options', () => {
    const wrapper = mount(NativeSelect, {
      props: { modelValue: 'a', options, ariaLabel: 'Sort order' },
    })

    const select = wrapper.get('select')
    expect(select.attributes('aria-label')).toBe('Sort order')
    expect(select.element.value).toBe('a')
    expect(wrapper.findAll('option')).toHaveLength(2)
  })

  it('emits update:modelValue with the new value on change', async () => {
    const wrapper = mount(NativeSelect, {
      props: { modelValue: 'a', options },
    })

    await wrapper.get('select').setValue('b')
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
  })

  it('forwards the disabled state', () => {
    const wrapper = mount(NativeSelect, {
      props: { modelValue: 'a', options, disabled: true },
    })

    expect(wrapper.get('select').attributes('disabled')).toBeDefined()
  })
})
