import { mount } from '@vue/test-utils'
import SearchField from '../src/ui/atoms/SearchField.vue'

describe('SearchField', () => {
  it('renders a labelled search input', () => {
    const wrapper = mount(SearchField, { props: { modelValue: '' } })
    const input = wrapper.get('input')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('aria-label')).toBe('Search')
  })

  it('renders a custom placeholder', () => {
    const wrapper = mount(SearchField, {
      props: { modelValue: '', placeholder: 'Find a book' },
    })
    expect(wrapper.get('input').attributes('placeholder')).toBe('Find a book')
  })

  it('shows the clear button only while there is text', async () => {
    const wrapper = mount(SearchField, {
      props: { modelValue: '', 'onUpdate:modelValue': () => undefined },
    })
    expect(wrapper.find('button').exists()).toBe(false)

    await wrapper.setProps({ modelValue: 'hello' })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Clear search')
  })

  it('clears the value when the clear button is clicked', async () => {
    const wrapper = mount(SearchField, { props: { modelValue: 'hello' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
  })

  it('emits the typed value on input', async () => {
    const wrapper = mount(SearchField, { props: { modelValue: '' } })
    await wrapper.get('input').setValue('shelf')
    expect(wrapper.emitted('update:modelValue')).toEqual([['shelf']])
  })
})
