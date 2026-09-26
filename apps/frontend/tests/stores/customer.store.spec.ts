import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Order } from '@/modules/checkout'
import {
  CUSTOMERS_STORAGE_KEY,
  MAGIC_LINK_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  useCustomerStore,
} from '@/modules/customer/stores/customer.store'

function sampleOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'SHELF-20260926-000001',
    placedAt: '2026-09-26T10:00:00.000Z',
    email: 'ada@example.com',
    name: 'Ada Lovelace',
    addressLine1: '12 Analytical Engine Lane',
    addressLine2: '',
    city: 'London',
    zip: 'SW1A 1AA',
    country: 'United Kingdom',
    lines: [
      {
        bookId: 'book-1',
        title: 'Notes on Engines',
        author: 'Charles Babbage',
        priceCents: 1800,
        quantity: 2,
        lineTotalCents: 3600,
      },
    ],
    subtotalCents: 3600,
    shippingCents: 0,
    totalCents: 3600,
    ...overrides,
  }
}

function signInViaMagicLink(email: string): void {
  const store = useCustomerStore()
  store.requestMagicLink(email)
  store.verifyMagicLink(store.magicLink!.token)
}

function sampleAddressInput(overrides: Record<string, string> = {}) {
  return {
    label: 'Home',
    name: 'Ada Lovelace',
    addressLine1: '12 Analytical Engine Lane',
    addressLine2: '',
    city: 'London',
    zip: 'SW1A 1AA',
    country: 'United Kingdom',
    ...overrides,
  }
}

describe('customer.store', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts signed out with no session', () => {
    const store = useCustomerStore()

    expect(store.isSignedIn).toBe(false)
    expect(store.current).toBeNull()
  })

  it('rejects an invalid email when requesting a magic link', () => {
    const store = useCustomerStore()

    const result = store.requestMagicLink('not-an-email')

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Enter a valid email address.')
    expect(store.magicLink).toBeNull()
  })

  it('persists the magic link request for later verification', () => {
    const store = useCustomerStore()

    const result = store.requestMagicLink('ADA@example.com')

    expect(result.ok).toBe(true)
    expect(store.magicLink).toMatchObject({ email: 'ada@example.com' })
    expect(store.magicLink?.token).toHaveLength(32)
    expect(store.magicLink?.expiresAt).toBeTruthy()

    const stored = JSON.parse(
      window.localStorage.getItem(MAGIC_LINK_STORAGE_KEY)!,
    )
    expect(stored.email).toBe('ada@example.com')
  })

  it('verifies a magic link for a new email, creating the account on sign up', () => {
    const store = useCustomerStore()
    store.requestMagicLink('ada@example.com')

    const result = store.verifyMagicLink(store.magicLink!.token)

    expect(result.ok).toBe(true)
    expect(result.isNewCustomer).toBe(true)
    expect(store.isSignedIn).toBe(true)
    expect(store.current).toMatchObject({
      email: 'ada@example.com',
      orders: [],
    })
    expect(window.localStorage.getItem(MAGIC_LINK_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBe(
      store.current?.id,
    )

    const stored = JSON.parse(
      window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)!,
    )
    expect(stored).toHaveLength(1)
  })

  it('verifies a magic link for an existing customer without duplicating the account', () => {
    signInViaMagicLink('ada@example.com')
    expect(useCustomerStore().current?.email).toBe('ada@example.com')
    useCustomerStore().signOut()

    const store = useCustomerStore()
    store.requestMagicLink('ada@example.com')
    const result = store.verifyMagicLink(store.magicLink!.token)

    expect(result.ok).toBe(true)
    expect(result.isNewCustomer).toBe(false)
    expect(store.current?.email).toBe('ada@example.com')

    const stored = JSON.parse(
      window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)!,
    )
    expect(stored).toHaveLength(1)
  })

  it('rejects an unknown or already-consumed magic link token', () => {
    const store = useCustomerStore()
    store.requestMagicLink('ada@example.com')
    const token = store.magicLink!.token

    const ok = store.verifyMagicLink(token)
    expect(ok.ok).toBe(true)

    const replay = store.verifyMagicLink(token)
    expect(replay.ok).toBe(false)
    expect(replay.error).toContain('invalid or has expired')
  })

  it('rejects an expired magic link', () => {
    window.localStorage.setItem(
      MAGIC_LINK_STORAGE_KEY,
      JSON.stringify({
        email: 'ada@example.com',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      }),
    )
    setActivePinia(createPinia())
    const store = useCustomerStore()

    const result = store.verifyMagicLink('expired-token')

    expect(result.ok).toBe(false)
    expect(result.error).toContain('expired')
    expect(store.isSignedIn).toBe(false)
    expect(window.localStorage.getItem(MAGIC_LINK_STORAGE_KEY)).toBeNull()
  })

  it('signs out and clears the session', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()

    store.signOut()

    expect(store.isSignedIn).toBe(false)
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })

  it('restores the session and customer list from storage', () => {
    signInViaMagicLink('ada@example.com')
    const id = useCustomerStore().customerId!

    setActivePinia(createPinia())
    const reloaded = useCustomerStore()

    expect(reloaded.customerId).toBe(id)
    expect(reloaded.current?.email).toBe('ada@example.com')
  })

  it('records an order onto the signed-in customer, newest first', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()

    store.recordOrder(sampleOrder({ id: 'SHELF-20260926-000001' }))
    store.recordOrder(sampleOrder({ id: 'SHELF-20261001-000001' }))

    expect(store.current?.orders.map((order) => order.id)).toEqual([
      'SHELF-20261001-000001',
      'SHELF-20260926-000001',
    ])

    const stored = JSON.parse(
      window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)!,
    )
    expect(stored[0].orders).toHaveLength(2)
  })

  it('does not record orders while signed out', () => {
    const store = useCustomerStore()

    store.recordOrder(sampleOrder())

    expect(store.current).toBeNull()
  })

  it('adds an address, auto-designating the first as primary, shipping and billing', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()

    const result = store.addAddress(sampleAddressInput())

    expect(result.ok).toBe(true)
    const address = store.current!.addresses[0]
    expect(address).toMatchObject({
      label: 'Home',
      city: 'London',
      zip: 'SW1A 1AA',
    })
    expect(store.current!.primaryAddressId).toBe(address.id)
    expect(store.current!.shippingAddressId).toBe(address.id)
    expect(store.current!.billingAddressId).toBe(address.id)

    const stored = JSON.parse(
      window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)!,
    )
    expect(stored[0].addresses).toHaveLength(1)
    expect(stored[0].primaryAddressId).toBe(address.id)
  })

  it('updates an existing address', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()
    store.addAddress(sampleAddressInput())
    const address = store.current!.addresses[0]

    const result = store.updateAddress(address.id, {
      label: 'Office',
      name: 'Ada Lovelace',
      addressLine1: '1 Babbage Square',
      addressLine2: 'Floor 3',
      city: 'Manchester',
      zip: 'M1 1AE',
      country: 'United Kingdom',
    })

    expect(result.ok).toBe(true)
    expect(store.current!.addresses[0]).toMatchObject({
      id: address.id,
      label: 'Office',
      addressLine1: '1 Babbage Square',
      city: 'Manchester',
    })
    expect(store.current!.addresses).toHaveLength(1)
  })

  it('removes an address and clears its role designations', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()
    store.addAddress(sampleAddressInput())
    store.addAddress(
      sampleAddressInput({ label: 'Office', addressLine1: '1 Babbage Square' }),
    )
    const home = store.current!.addresses[0]
    const office = store.current!.addresses[1]
    store.setPrimaryAddress(office.id)
    store.setShippingAddress(office.id)
    store.setBillingAddress(office.id)

    store.removeAddress(office.id)

    expect(store.current!.addresses.map((a) => a.id)).toEqual([home.id])
    expect(store.current!.primaryAddressId).toBeNull()
    expect(store.current!.shippingAddressId).toBeNull()
    expect(store.current!.billingAddressId).toBeNull()
  })

  it('sets primary, shipping and billing roles independently', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()
    store.addAddress(sampleAddressInput())
    store.addAddress(
      sampleAddressInput({ label: 'Office', addressLine1: '1 Babbage Square' }),
    )
    const home = store.current!.addresses[0]
    const office = store.current!.addresses[1]

    store.setPrimaryAddress(office.id)
    store.setShippingAddress(office.id)
    store.setBillingAddress(office.id)
    store.setPrimaryAddress(home.id)

    expect(store.current!.primaryAddressId).toBe(home.id)
    expect(store.current!.shippingAddressId).toBe(office.id)
    expect(store.current!.billingAddressId).toBe(office.id)
  })

  it('rejects adding an address while signed out', () => {
    const store = useCustomerStore()

    const result = store.addAddress(sampleAddressInput())

    expect(result.ok).toBe(false)
    expect(result.error).toContain('Sign in')
  })

  it('creates accounts with default notification preferences', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()

    expect(store.current?.notifications).toEqual({
      orderUpdates: true,
      recommendations: false,
      newsAndDeals: false,
    })

    const stored = JSON.parse(
      window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)!,
    )
    expect(stored[0].notifications).toEqual(store.current!.notifications)
  })

  it('changes the signed-in customer email and persists it', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()

    const result = store.changeEmail('  NEW@Example.com ')

    expect(result.ok).toBe(true)
    expect(store.current?.email).toBe('new@example.com')

    const stored = JSON.parse(
      window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)!,
    )
    expect(stored[0].email).toBe('new@example.com')
  })

  it('rejects invalid, unchanged or duplicated emails', () => {
    const store = useCustomerStore()
    signInViaMagicLink('ada@example.com')
    const adaId = store.current!.id
    store.signOut()
    signInViaMagicLink('bob@example.com')
    store.signOut()
    signInViaMagicLink('ada@example.com')
    expect(store.current!.id).toBe(adaId)

    expect(store.changeEmail('not-an-email').ok).toBe(false)
    expect(store.changeEmail('ada@example.com').ok).toBe(false)
    expect(store.changeEmail('bob@example.com').error).toContain(
      'another account',
    )
    expect(store.current?.email).toBe('ada@example.com')
  })

  it('rejects changing the email while signed out', () => {
    const store = useCustomerStore()

    const result = store.changeEmail('new@example.com')

    expect(result.ok).toBe(false)
    expect(result.error).toContain('Sign in')
  })

  it('updates notification preferences and persists them', () => {
    signInViaMagicLink('ada@example.com')
    const store = useCustomerStore()

    const result = store.updateNotificationPrefs({
      recommendations: true,
      newsAndDeals: true,
    })

    expect(result.ok).toBe(true)
    expect(store.current?.notifications).toEqual({
      orderUpdates: true,
      recommendations: true,
      newsAndDeals: true,
    })

    const stored = JSON.parse(
      window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)!,
    )
    expect(stored[0].notifications.newsAndDeals).toBe(true)
  })

  it('normalizes stored customers missing notification preferences', () => {
    window.localStorage.setItem(
      CUSTOMERS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'legacy-1',
          email: 'legacy@example.com',
          createdAt: '2026-01-01T00:00:00.000Z',
          orders: [],
        },
      ]),
    )
    setActivePinia(createPinia())

    const store = useCustomerStore()

    expect(store.customers[0]).toMatchObject({
      addresses: [],
      primaryAddressId: null,
      shippingAddressId: null,
      billingAddressId: null,
      notifications: {
        orderUpdates: true,
        recommendations: false,
        newsAndDeals: false,
      },
    })
  })
})
