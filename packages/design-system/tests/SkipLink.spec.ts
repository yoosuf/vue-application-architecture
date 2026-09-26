import { mount } from '@vue/test-utils'
import SkipLink from '../src/ui/atoms/SkipLink.vue'

describe('SkipLink', () => {
  it('links to the main-content target by default', () => {
    const wrapper = mount(SkipLink)
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('#main-content')
    expect(link.text()).toContain('Skip to content')
  })

  it('supports a custom target id and label', () => {
    const wrapper = mount(SkipLink, {
      props: { targetId: 'search-results', label: 'Skip to results' },
    })
    expect(wrapper.get('a').attributes('href')).toBe('#search-results')
    expect(wrapper.get('a').text()).toContain('Skip to results')
  })

  it('moves focus to the target when activated', async () => {
    const target = document.createElement('div')
    target.id = 'main-content'
    document.body.appendChild(target)
    const wrapper = mount(SkipLink)
    await wrapper.get('a').trigger('click')
    expect(document.activeElement).toBe(target)
    target.remove()
  })
})
