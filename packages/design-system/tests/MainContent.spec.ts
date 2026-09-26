import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent } from 'vue'
import MainContent from '../src/ui/molecules/MainContent.vue'

const Home = defineComponent({ template: '<p>Home page</p>' })

function routerFor() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'home', component: Home }],
  })
}

describe('MainContent', () => {
  it('renders the routed page inside the main landmark', async () => {
    const router = routerFor()
    const wrapper = mount(MainContent, { global: { plugins: [router] } })
    await router.isReady()
    const main = wrapper.get('main')
    expect(main.attributes('id')).toBe('main-content')
    expect(main.text()).toContain('Home page')
  })

  it('shows a loading indicator and no page while loading', async () => {
    const wrapper = mount(MainContent, {
      props: { loading: true },
      global: { plugins: [routerFor()] },
    })
    expect(wrapper.get('[role="status"]').text()).toContain('Loading page')
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
