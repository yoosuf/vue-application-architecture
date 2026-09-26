import { mount } from '@vue/test-utils'
import FilterGroup from '../src/ui/molecules/FilterGroup.vue'
import Chip from '../src/ui/atoms/Chip.vue'

describe('FilterGroup', () => {
  it('renders a labelled group with its slot content', () => {
    const wrapper = mount(FilterGroup, {
      props: { label: 'Filter books by category' },
      slots: { default: '<button>All</button>' },
    })
    const group = wrapper.get('[role="group"]')
    expect(group.attributes('aria-label')).toBe('Filter books by category')
    expect(group.text()).toContain('All')
  })

  it('keeps chips toggleable within the group', () => {
    const wrapper = mount(FilterGroup, {
      props: { label: 'Filter books by category' },
      slots: {
        default:
          '<Chip label="Fantasy" :selected="false" /><Chip label="Sci-Fi" :selected="true" />',
      },
      global: { components: { Chip } },
    })
    const chips = wrapper.findAll('button')
    expect(chips).toHaveLength(2)
    expect(chips[0].attributes('aria-pressed')).toBe('false')
    expect(chips[1].attributes('aria-pressed')).toBe('true')
  })
})
