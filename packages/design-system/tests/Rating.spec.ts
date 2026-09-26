import { mount } from '@vue/test-utils'
import Rating from '../src/ui/atoms/Rating.vue'

describe('Rating', () => {
  it('announces the rating for assistive tech', () => {
    const wrapper = mount(Rating, { props: { value: 4 } })
    expect(wrapper.get('span').attributes('aria-label')).toBe(
      'Rated 4 out of 5',
    )
  })

  it('renders the value with one decimal place', () => {
    const wrapper = mount(Rating, { props: { value: 3.5 } })
    expect(wrapper.text()).toContain('3.5')
  })

  it('hides the star icon from assistive tech', () => {
    const wrapper = mount(Rating, { props: { value: 5 } })
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })
})
