import { mount } from '@vue/test-utils'
import SearchBar from '../src/ui/molecules/SearchBar.vue'

describe('SearchBar', () => {
  it('carries the model value through to the native input', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: 'vue' } })
    expect(wrapper.get('input').element.value).toBe('vue')
  })

  it('forwards typed input as an update:modelValue event', async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    await wrapper.get('input').setValue('shelf')
    expect(wrapper.emitted('update:modelValue')).toEqual([['shelf']])
  })
})
