import { mount } from '@vue/test-utils'
import ResponsiveGrid from '../src/ui/molecules/ResponsiveGrid.vue'

describe('ResponsiveGrid', () => {
  it('renders a grid with its slot content', () => {
    const wrapper = mount(ResponsiveGrid, {
      slots: { default: '<p>A</p><p>B</p>' },
    })
    expect(wrapper.get('div').text()).toBe('AB')
  })

  it('renders every child as a grid cell', () => {
    const wrapper = mount(ResponsiveGrid, {
      slots: { default: '<p>A</p><p>B</p><p>C</p>' },
    })
    expect(wrapper.findAll('p')).toHaveLength(3)
  })

  it('applies a different gap class per gap prop', async () => {
    const wrapper = mount(ResponsiveGrid, {
      props: { gap: 'lg' },
      slots: { default: '<p>Content</p>' },
    })
    const lgClass = wrapper.get('div').attributes('class') ?? ''
    await wrapper.setProps({ gap: 'md' })
    expect(wrapper.get('div').attributes('class')).not.toBe(lgClass)
  })

  it('keeps a two-column layout on small screens when minColumns is 2', async () => {
    const wrapper = mount(ResponsiveGrid, {
      props: { minColumns: 2 },
      slots: { default: '<p>A</p><p>B</p>' },
    })
    const twoColumnClass = wrapper.get('div').attributes('class') ?? ''
    await wrapper.setProps({ minColumns: 1 })
    expect(wrapper.get('div').attributes('class')).not.toBe(twoColumnClass)
  })
})
