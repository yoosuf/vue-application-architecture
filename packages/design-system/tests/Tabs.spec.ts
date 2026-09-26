import { h } from 'vue'
import { mount } from '@vue/test-utils'
import Tabs from '../src/ui/molecules/Tabs.vue'

const panelSlot = ({ index }: { index: number }) =>
  index === 0 ? h('p', 'Panel A') : h('p', 'Panel B')

function mountTabs(modelValue?: number) {
  return mount(Tabs, {
    props: {
      labels: ['Alpha', 'Beta'],
      ...(modelValue !== undefined ? { modelValue } : {}),
    },
    slots: { default: panelSlot },
  })
}

describe('Tabs', () => {
  it('renders one tab per label and activates the first by default', () => {
    const wrapper = mountTabs()
    expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual([
      'Alpha',
      'Beta',
    ])
    expect(wrapper.get('[role="tab"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.get('[role="tabpanel"]').text()).toBe('Panel A')
  })

  it('switches content and emits updates when a tab is clicked', async () => {
    const wrapper = mountTabs()
    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.get('[role="tabpanel"]').text()).toBe('Panel B')
    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe(
      'true',
    )
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(wrapper.emitted('change')).toEqual([[1]])
  })

  it('moves the active tab with arrow keys', async () => {
    const wrapper = mountTabs()
    await wrapper.get('[role="tablist"]').trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.get('[role="tabpanel"]').text()).toBe('Panel B')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('respects a controlled modelValue', () => {
    const wrapper = mountTabs(1)
    expect(wrapper.get('[role="tabpanel"]').text()).toBe('Panel B')
    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe(
      'true',
    )
  })
})
