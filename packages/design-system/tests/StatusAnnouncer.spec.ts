import { mount } from '@vue/test-utils'
import StatusAnnouncer from '../src/ui/atoms/StatusAnnouncer.vue'

describe('StatusAnnouncer', () => {
  it('renders a polite live region with the message', () => {
    const wrapper = mount(StatusAnnouncer, {
      props: { message: 'Added to cart' },
    })
    const region = wrapper.get('[role="status"]')
    expect(region.attributes('aria-live')).toBe('polite')
    expect(region.text()).toContain('Added to cart')
  })

  it('updates the announced message', async () => {
    const wrapper = mount(StatusAnnouncer, {
      props: { message: 'Added to cart' },
    })
    await wrapper.setProps({ message: 'Removed from cart' })
    expect(wrapper.get('[role="status"]').text()).toContain('Removed from cart')
  })
})
