import { mount } from '@vue/test-utils'
import QuantityStepper from '../src/ui/atoms/QuantityStepper.vue'

describe('QuantityStepper', () => {
  it('renders the current quantity', () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 3 } })
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('3')
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe(
      'Quantity',
    )
  })

  it('increments on plus', async () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 2 } })
    await wrapper.get('button[aria-label="Increase quantity"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('decrements on minus', async () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 2 } })
    await wrapper.get('button[aria-label="Decrease quantity"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('disables minus at the minimum', () => {
    const wrapper = mount(QuantityStepper, { props: { modelValue: 1 } })
    expect(
      wrapper
        .get('button[aria-label="Decrease quantity"]')
        .attributes('disabled'),
    ).toBeDefined()
  })

  it('disables plus at the maximum', () => {
    const wrapper = mount(QuantityStepper, {
      props: { modelValue: 5, max: 5 },
    })
    expect(
      wrapper
        .get('button[aria-label="Increase quantity"]')
        .attributes('disabled'),
    ).toBeDefined()
  })
})
