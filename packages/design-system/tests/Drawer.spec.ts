import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Drawer from '../src/ui/molecules/Drawer.vue'

const slots = {
  default: '<p id="demo-body">Drawer body</p>',
  footer: '<button id="demo-footer">Pay now</button>',
}

function mountDrawer(open = false) {
  return mount(Drawer, {
    props: { open, title: 'Your Cart' },
    slots,
    attachTo: document.body,
  })
}

describe('Drawer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('is hidden and not interactive when closed', () => {
    const wrapper = mountDrawer(false)
    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.attributes('aria-hidden')).toBe('true')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-labelledby')).toBeDefined()
  })

  it('shows the title, body and footer when open', async () => {
    const wrapper = mountDrawer(true)
    await nextTick()

    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.attributes('aria-hidden')).toBe('false')
    expect(wrapper.text()).toContain('Your Cart')
    expect(wrapper.text()).toContain('Drawer body')
    expect(wrapper.get('#demo-footer').text()).toBe('Pay now')
  })

  it('emits close from the close button', async () => {
    const wrapper = mountDrawer(true)
    await wrapper.get('button[aria-label="Close Your Cart"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when Escape is pressed', async () => {
    const wrapper = mountDrawer(true)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when the scrim is clicked', async () => {
    const wrapper = mountDrawer(true)
    await wrapper.get('[aria-hidden="true"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('restores previous focus when it closes', async () => {
    const trigger = document.createElement('button')
    trigger.id = 'drawer-trigger'
    document.body.appendChild(trigger)
    trigger.focus()

    const wrapper = mountDrawer(true)
    await nextTick()
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Close Your Cart',
    )

    await wrapper.setProps({ open: false })
    await nextTick()
    expect(document.activeElement?.id).toBe('drawer-trigger')
    trigger.remove()
  })
})
