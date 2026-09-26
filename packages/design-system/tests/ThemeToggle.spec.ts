import { mount } from '@vue/test-utils'
import ThemeToggle from '../src/ui/atoms/ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('shows the dark-switch label in light mode', () => {
    const wrapper = mount(ThemeToggle, { props: { theme: 'light' } })
    expect(wrapper.get('button').attributes('aria-label')).toBe(
      'Switch to dark theme',
    )
  })

  it('shows the light-switch label in dark mode', () => {
    const wrapper = mount(ThemeToggle, { props: { theme: 'dark' } })
    expect(wrapper.get('button').attributes('aria-label')).toBe(
      'Switch to light theme',
    )
  })

  it('announces the active theme in a live status region', () => {
    const wrapper = mount(ThemeToggle, { props: { theme: 'dark' } })
    const status = wrapper.get('[role="status"]')
    expect(status.attributes('aria-live')).toBe('polite')
    expect(status.text()).toBe('Dark theme enabled')
  })

  it('emits toggle when clicked', async () => {
    const wrapper = mount(ThemeToggle, { props: { theme: 'light' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })
})
