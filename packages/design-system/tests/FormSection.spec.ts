import { mount } from '@vue/test-utils'
import FormSection from '../src/ui/molecules/FormSection.vue'

describe('FormSection', () => {
  it('renders a fieldset labelled by its legend', () => {
    const wrapper = mount(FormSection, {
      props: { legend: 'Shipping' },
      slots: { default: '<input aria-label="Name" />' },
    })
    const fieldset = wrapper.get('fieldset')
    expect(wrapper.get('legend').text()).toBe('Shipping')
    expect(fieldset.element.querySelector('legend')).toBeTruthy()
  })

  it('places the slot content inside the section card', () => {
    const wrapper = mount(FormSection, {
      props: { legend: 'Contact' },
      slots: { default: '<p class="field">Email</p>' },
    })
    const card = wrapper.get('.field').element.closest('div')
    expect(card).toBeTruthy()
  })

  it('supports a required legend prop', () => {
    const wrapper = mount(FormSection, { props: { legend: 'Payment' } })
    expect(wrapper.get('legend').text()).toBe('Payment')
  })
})
