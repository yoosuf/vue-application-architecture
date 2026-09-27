import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '@/app/App.vue'
import { appRoutes } from '@/app/router'
import { useCatalogStore } from '@/modules/catalog/stores/catalog.store'
import { useCartStore } from '@/modules/cart/stores/cart.store'
import { useCheckoutStore } from '@/modules/checkout/stores/checkout.store'
import { useCustomerStore } from '@/modules/customer/stores/customer.store'
import { useFavoritesStore } from '@/modules/favorites/stores/favorites.store'
import { usePreferencesStore } from '@/modules/core'

async function mountApp() {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: appRoutes,
  })

  const wrapper = mount(App, {
    global: {
      plugins: [pinia, router],
    },
  })

  await router.isReady()
  await flushPromises()

  return { wrapper, router }
}

describe('router', () => {
  it('renders the Explore page at "/" with featured book and heading', async () => {
    const { wrapper } = await mountApp()
    const catalog = useCatalogStore()

    const headings = wrapper.findAll('h2').map((heading) => heading.text())

    expect(headings).toContain('Explore Books')
    expect(wrapper.get('h1#featured-title').text()).toBe(
      catalog.featuredBook!.title,
    )
  })

  it('filters Explore by category chip and navigates to /collections/:category', async () => {
    const { wrapper, router } = await mountApp()

    const fiction = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Fiction')!
    await fiction.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('collection')
    expect(router.currentRoute.value.params.category).toBe('fiction')

    const catalog = useCatalogStore()
    expect(catalog.selectedCategory).toBe('Fiction')
    expect(
      catalog.sortedBooks.every((book) => book.category === 'Fiction'),
    ).toBe(true)

    const all = wrapper
      .findAll('button')
      .find((button) => button.text() === 'All')!
    await all.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('explore')
    expect(catalog.selectedCategory).toBe('All')
  })

  it('hydrates the category filter from the collection path', async () => {
    const { router } = await mountApp()
    const catalog = useCatalogStore()

    await router.push('/collections/science')
    await flushPromises()

    expect(catalog.selectedCategory).toBe('Science')
  })

  it('opens the cart drawer from the header cart button', async () => {
    const { wrapper } = await mountApp()

    const cartDialog = () =>
      wrapper
        .findAll('[role="dialog"]')
        .find((element) => element.text().includes('Your Cart'))!
    expect(cartDialog().attributes('aria-hidden')).toBe('true')

    await wrapper.get('button[aria-label="Cart, empty"]').trigger('click')

    expect(cartDialog().attributes('aria-hidden')).toBe('false')

    useCartStore().closeCart()
    await flushPromises()
  })

  it('renders the book details at "/products/:id"', async () => {
    const { wrapper, router } = await mountApp()
    const catalog = useCatalogStore()
    const book = catalog.books[0]

    await router.push(`/products/${book.id}`)

    expect(wrapper.get('h1').text()).toBe(book.title)
    expect(wrapper.text()).toContain(`Published ${book.year}`)
    expect(wrapper.text()).toContain(book.description)
    expect(wrapper.get('#related-books-title').text()).toBe('You may also like')
    expect(wrapper.get('#related-books-title').element.tagName).toBe('H2')
  })

  it('routes from a book card to its details page', async () => {
    const { wrapper, router } = await mountApp()
    const catalog = useCatalogStore()
    const book = catalog.books[1]

    const cardLink = wrapper.find(
      `a[aria-label="${book.title} by ${book.author}"]`,
    )
    expect(cardLink.exists()).toBe(true)

    await cardLink.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('book-details')
    expect(router.currentRoute.value.params.id).toBe(book.id)
    expect(wrapper.get('h1').text()).toBe(book.title)
  })

  it('renders the not-found page for unknown routes', async () => {
    const { wrapper, router } = await mountApp()

    await router.push('/no/such/page')

    expect(wrapper.text()).toContain('Page not found')
  })

  it('renders the empty cart state at "/cart"', async () => {
    const { wrapper, router } = await mountApp()

    await router.push('/cart')

    expect(wrapper.get('h1').text()).toBe('Your cart is empty.')
  })

  it('lists cart lines at "/cart" with an item in the cart', async () => {
    const { wrapper, router } = await mountApp()
    const book = useCatalogStore().books[0]
    useCartStore().addBook(book.id, 2)

    await router.push('/cart')

    expect(wrapper.get('h1').text()).toBe('Your Cart')
    expect(wrapper.text()).toContain(book.title)
    expect(wrapper.text()).toContain('Proceed to Checkout')
  })

  it('checks out a cart into an order confirmation', async () => {
    const { wrapper, router } = await mountApp()
    const book = useCatalogStore().books[0]
    useCartStore().addBook(book.id)

    await router.push('/checkout')
    expect(wrapper.get('h1').text()).toBe('Checkout')

    await wrapper.get('input[autocomplete="email"]').setValue('ada@example.com')
    await wrapper.get('input[autocomplete="name"]').setValue('Ada Lovelace')
    await wrapper
      .get('input[autocomplete="address-line1"]')
      .setValue('12 Analytical Engine Lane')
    await wrapper.get('input[autocomplete="address-level2"]').setValue('London')
    await wrapper.get('input[autocomplete="postal-code"]').setValue('SW1A 1AA')
    await wrapper.get('input[autocomplete="cc-name"]').setValue('Ada Lovelace')
    await wrapper
      .get('input[autocomplete="cc-number"]')
      .setValue('4242 4242 4242 4242')
    await wrapper.get('input[autocomplete="cc-exp"]').setValue('12 / 28')
    await wrapper.get('input[autocomplete="cc-csc"]').setValue('123')

    await wrapper.get('form').trigger('submit')

    const order = useCheckoutStore().lastOrder!
    expect(order.id).toMatch(/^SHELF-\d{8}-\d{6}$/)
    expect(wrapper.text()).toContain(`Order ${order.id}`)
    expect(wrapper.text()).toContain(book.title)
    expect(useCartStore().count).toBe(0)
  })

  it('shows an empty checkout state without any items', async () => {
    const { wrapper, router } = await mountApp()

    await router.push('/checkout')

    expect(wrapper.get('h1').text()).toBe('Nothing to check out yet.')
  })

  it('shows Log in in the header when signed out and Account when signed in', async () => {
    const { wrapper } = await mountApp()

    expect(wrapper.text()).toContain('Log in')
    expect(wrapper.text()).not.toContain('Account')

    const customer = useCustomerStore()
    customer.requestMagicLink('ada@example.com')
    expect(customer.verifyMagicLink(customer.magicLink!.token).ok).toBe(true)
    await flushPromises()

    expect(wrapper.text()).toContain('Account')
    expect(wrapper.text()).not.toContain('Log in')
  })

  it('signs in via the magic link form and lands on the account page', async () => {
    const { wrapper, router } = await mountApp()

    await router.push('/login')
    expect(wrapper.get('h1').text()).toBe('Log In')

    await wrapper
      .get('input[autocomplete="email"]')
      .setValue('newcustomer@example.com')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Check your email')
    expect(wrapper.text()).toContain('newcustomer@example.com')

    const magicLinkButton = wrapper
      .findAll('a')
      .find((button) => button.text().includes('Open the magic link'))
    expect(magicLinkButton).toBeDefined()
    await magicLinkButton!.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('account-orders')
    expect(wrapper.get('h1').text()).toBe('Hello, Newcustomer')
    expect(wrapper.text()).toContain('newcustomer@example.com')
    expect(wrapper.text()).toContain('No orders yet.')
  })

  it('redirects "/account" to login when signed out', async () => {
    const { router } = await mountApp()

    await router.push('/account')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('account-orders')
  })

  it('records a placed order on the signed-in customer and shows it in the account history', async () => {
    const { wrapper, router } = await mountApp()
    const book = useCatalogStore().books[0]
    const customer = useCustomerStore()
    customer.requestMagicLink('ada@example.com')
    customer.verifyMagicLink(customer.magicLink!.token)
    useCartStore().addBook(book.id)

    await router.push('/checkout')
    await wrapper.get('input[autocomplete="email"]').setValue('ada@example.com')
    await wrapper.get('input[autocomplete="name"]').setValue('Ada Lovelace')
    await wrapper
      .get('input[autocomplete="address-line1"]')
      .setValue('12 Analytical Engine Lane')
    await wrapper.get('input[autocomplete="address-level2"]').setValue('London')
    await wrapper.get('input[autocomplete="postal-code"]').setValue('SW1A 1AA')
    await wrapper.get('input[autocomplete="cc-name"]').setValue('Ada Lovelace')
    await wrapper
      .get('input[autocomplete="cc-number"]')
      .setValue('4242 4242 4242 4242')
    await wrapper.get('input[autocomplete="cc-exp"]').setValue('12 / 28')
    await wrapper.get('input[autocomplete="cc-csc"]').setValue('123')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const order = useCheckoutStore().lastOrder!
    expect(wrapper.text()).toContain('saved to your account')
    expect(
      useCustomerStore().current?.orders.some((item) => item.id === order.id),
    ).toBe(true)

    await router.push('/account')
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Hello, Ada')
    expect(wrapper.text()).toContain(`Order ${order.id}`)
    expect(wrapper.text()).toContain(book.title)
  })

  it('adds and designates an address on the account page', async () => {
    const { wrapper, router } = await mountApp()
    const customer = useCustomerStore()
    customer.requestMagicLink('ada@example.com')
    customer.verifyMagicLink(customer.magicLink!.token)

    await router.push('/account')
    await flushPromises()

    const addressesLink = wrapper
      .get('nav[aria-label="Account"]')
      .findAll('a')
      .find((link) => link.text() === 'Addresses')
    expect(addressesLink).toBeDefined()
    await addressesLink!.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('account-addresses')
    expect(wrapper.text()).toContain('No saved addresses yet')

    const addButtons = wrapper
      .findAll('button')
      .filter((button) => button.text() === 'Add Address')
    await addButtons[0].trigger('click')
    await flushPromises()

    await wrapper.get('input[autocomplete="name"]').setValue('Ada Lovelace')
    await wrapper
      .get('input[autocomplete="address-line1"]')
      .setValue('12 Analytical Engine Lane')
    await wrapper.get('input[autocomplete="address-line2"]').setValue('Apt 4')
    await wrapper.get('input[autocomplete="address-level2"]').setValue('London')
    await wrapper.get('input[autocomplete="postal-code"]').setValue('SW1A 1AA')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('12 Analytical Engine Lane')
    expect(wrapper.text()).toContain('Primary')
    expect(wrapper.text()).toContain('Shipping')
    expect(wrapper.text()).toContain('Billing')

    const customerAfter = useCustomerStore().current!
    expect(customerAfter.addresses).toHaveLength(1)
    expect(customerAfter.shippingAddressId).toBe(customerAfter.addresses[0].id)
  })

  it('navigates account sections via the sidebar and logs out', async () => {
    const { wrapper, router } = await mountApp()
    const customer = useCustomerStore()
    customer.requestMagicLink('ada@example.com')
    customer.verifyMagicLink(customer.magicLink!.token)

    await router.push('/account')
    await flushPromises()

    const sidebarNav = wrapper.get('nav[aria-label="Account"]')
    const clickNav = async (label: string) => {
      const link = sidebarNav
        .findAll('a')
        .find((candidate) => candidate.text() === label)
      const button = sidebarNav
        .findAll('button')
        .find((candidate) => candidate.text() === label)
      const element = link ?? button
      expect(element).toBeDefined()
      await element!.trigger('click')
      await flushPromises()
    }

    await clickNav('Orders')
    expect(router.currentRoute.value.name).toBe('account-orders')
    expect(wrapper.text()).toContain('No orders yet.')

    await clickNav('Profile')
    expect(router.currentRoute.value.name).toBe('account-profile')
    expect(wrapper.text()).toContain('Your details')
    expect(wrapper.text()).toContain('ada@example.com')
    expect(wrapper.text()).not.toContain('No orders yet.')

    await clickNav('Favorites')
    expect(router.currentRoute.value.name).toBe('account-favorites')
    expect(wrapper.text()).toContain('No favorites yet.')

    await clickNav('Account')
    expect(router.currentRoute.value.name).toBe('account-settings')
    expect(wrapper.text()).toContain('No password needed')
    expect(wrapper.text()).toContain('passwordless')
    expect(wrapper.text()).toContain('Email address')
    expect(wrapper.text()).toContain('Notifications')
    expect(wrapper.text()).toContain('News and deals')

    await clickNav('Addresses')
    expect(router.currentRoute.value.name).toBe('account-addresses')
    expect(wrapper.text()).toContain('No saved addresses yet')

    await clickNav('Log out')
    expect(router.currentRoute.value.name).toBe('explore')
    expect(wrapper.text()).toContain('Log in')
    expect(useCustomerStore().current).toBeNull()
  })

  it('changes email and toggles notifications on the account page', async () => {
    const { wrapper, router } = await mountApp()
    const customer = useCustomerStore()
    customer.requestMagicLink('ada@example.com')
    customer.verifyMagicLink(customer.magicLink!.token)

    await router.push('/account')
    await flushPromises()

    const sidebarNav = wrapper.get('nav[aria-label="Account"]')
    const accountLink = sidebarNav
      .findAll('a')
      .find((link) => link.text() === 'Account')
    expect(accountLink).toBeDefined()
    await accountLink!.trigger('click')
    await flushPromises()

    await wrapper
      .get('input[autocomplete="email"]')
      .setValue('grace@example.com')
    const saveEmail = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Save')
    expect(saveEmail).toBeDefined()
    await saveEmail!.trigger('click')
    await flushPromises()

    expect(useCustomerStore().current?.email).toBe('grace@example.com')
    expect(wrapper.text()).toContain('Email updated.')

    const newsToggle = wrapper.get(
      'button[role="switch"][aria-label="News and deals"]',
    )
    expect(newsToggle.attributes('aria-checked')).toBe('false')
    await newsToggle.trigger('click')

    expect(useCustomerStore().current?.notifications.newsAndDeals).toBe(true)

    await wrapper
      .get('button[role="switch"][aria-label="Recommendations"]')
      .trigger('click')
    expect(useCustomerStore().current?.notifications.recommendations).toBe(true)
  })

  it('deep-links to each account section route', async () => {
    const { wrapper, router } = await mountApp()
    const customer = useCustomerStore()
    customer.requestMagicLink('ada@example.com')
    customer.verifyMagicLink(customer.magicLink!.token)

    await router.push('/account/orders')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('account-orders')
    expect(wrapper.text()).toContain('No orders yet.')

    await router.push('/account/profile')
    await flushPromises()
    expect(wrapper.text()).toContain('Your details')
    expect(wrapper.text()).not.toContain('No orders yet.')

    await router.push('/account/settings')
    await flushPromises()
    expect(wrapper.text()).toContain('Email address')
    expect(wrapper.text()).toContain('Notifications')

    const book = useCatalogStore().books[0]
    useFavoritesStore().addFavorite(book.id)
    await router.push('/account/favorites')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('account-favorites')
    expect(wrapper.text()).toContain('1 book saved')
    expect(wrapper.text()).toContain(book.title)

    await router.push('/account/addresses')
    await flushPromises()
    expect(wrapper.text()).toContain('No saved addresses yet')

    await router.push('/account')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('account-orders')
  })

  it('redirects /account section routes to login when signed out', async () => {
    const { router } = await mountApp()

    await router.push('/account/settings')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('account-settings')
  })

  it('prefills checkout from the saved shipping address', async () => {
    const { wrapper, router } = await mountApp()
    const customer = useCustomerStore()
    customer.requestMagicLink('ada@example.com')
    customer.verifyMagicLink(customer.magicLink!.token)
    customer.addAddress({
      label: 'Home',
      name: 'Ada Lovelace',
      addressLine1: '12 Analytical Engine Lane',
      addressLine2: '',
      city: 'London',
      zip: 'SW1A 1AA',
      country: 'United Kingdom',
    })
    useCartStore().addBook(useCatalogStore().books[0].id)

    await router.push('/checkout')
    await flushPromises()

    const email = wrapper.get('input[autocomplete="email"]')
      .element as HTMLInputElement
    expect(email.value).toBe('ada@example.com')

    const street = wrapper.get('input[autocomplete="address-line1"]')
      .element as HTMLInputElement
    expect(street.value).toBe('12 Analytical Engine Lane')

    const city = wrapper.get('input[autocomplete="address-level2"]')
      .element as HTMLInputElement
    expect(city.value).toBe('London')

    const zip = wrapper.get('input[autocomplete="postal-code"]')
      .element as HTMLInputElement
    expect(zip.value).toBe('SW1A 1AA')
  })

  it('drives the CSS token theme from the preferences store', async () => {
    await mountApp()
    const preferences = usePreferencesStore()

    expect(document.documentElement.dataset.dsTheme).toBe('light')

    preferences.setTheme('dark')
    await flushPromises()

    expect(document.documentElement.dataset.dsTheme).toBe('dark')
  })
})
