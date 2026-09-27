import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Order } from '../../checkout'

export interface Address {
  id: string
  label: string
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  zip: string
  country: string
}

export interface AddressInput {
  label?: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  zip: string
  country: string
}

export interface NotificationPrefs {
  orderUpdates: boolean
  recommendations: boolean
  newsAndDeals: boolean
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  orderUpdates: true,
  recommendations: false,
  newsAndDeals: false,
}

export interface Customer {
  id: string
  email: string
  createdAt: string
  orders: Order[]
  addresses: Address[]
  primaryAddressId: string | null
  shippingAddressId: string | null
  billingAddressId: string | null
  notifications: NotificationPrefs
}

export interface MagicLinkRequest {
  email: string
  token: string
  expiresAt: string
}

export interface MagicLinkResult {
  ok: boolean
  error?: string
  isNewCustomer?: boolean
}

export interface AddressResult {
  ok: boolean
  error?: string
}

export const CUSTOMERS_STORAGE_KEY = 'shelf:customers'
export const SESSION_STORAGE_KEY = 'shelf:customer-session'
export const MAGIC_LINK_STORAGE_KEY = 'shelf:magic-login'

export const MAGIC_LINK_TTL_MINUTES: number = 15
const MAGIC_LINK_TTL_MS = MAGIC_LINK_TTL_MINUTES * 60 * 1000

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `customer-${Date.now()}`
}

function createToken(): string {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

function normalizeCustomer(customer: Customer): Customer {
  return {
    ...customer,
    addresses: customer.addresses ?? [],
    primaryAddressId: customer.primaryAddressId ?? null,
    shippingAddressId: customer.shippingAddressId ?? null,
    billingAddressId: customer.billingAddressId ?? null,
    notifications: {
      ...DEFAULT_NOTIFICATION_PREFS,
      ...customer.notifications,
    },
  }
}

function readStoredCustomers(): Customer[] {
  try {
    const raw = window.localStorage.getItem(CUSTOMERS_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map(normalizeCustomer)
  } catch {
    // Storage may be unavailable (private mode, quota). Best effort only.
  }
  return []
}

function readStoredSession(): string | null {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY)
  } catch {
    return null
  }
}

function readStoredMagicLink(): MagicLinkRequest | null {
  try {
    const raw = window.localStorage.getItem(MAGIC_LINK_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MagicLinkRequest
    if (
      parsed &&
      typeof parsed.email === 'string' &&
      typeof parsed.token === 'string' &&
      typeof parsed.expiresAt === 'string'
    ) {
      return parsed
    }
  } catch {
    // Storage may be unavailable. Best effort only.
  }
  return null
}

function persistCustomers(customers: Customer[]) {
  try {
    window.localStorage.setItem(
      CUSTOMERS_STORAGE_KEY,
      JSON.stringify(customers),
    )
  } catch {
    // Storage may be unavailable. Best effort only.
  }
}

function persistSession(customerId: string | null) {
  try {
    if (customerId === null) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
    } else {
      window.localStorage.setItem(SESSION_STORAGE_KEY, customerId)
    }
  } catch {
    // Storage may be unavailable. Best effort only.
  }
}

function persistMagicLink(request: MagicLinkRequest | null) {
  try {
    if (request === null) {
      window.localStorage.removeItem(MAGIC_LINK_STORAGE_KEY)
    } else {
      window.localStorage.setItem(
        MAGIC_LINK_STORAGE_KEY,
        JSON.stringify(request),
      )
    }
  } catch {
    // Storage may be unavailable. Best effort only.
  }
}

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>(readStoredCustomers())
  const customerId = ref<string | null>(readStoredSession())
  const magicLink = ref<MagicLinkRequest | null>(readStoredMagicLink())

  const current = computed(
    () =>
      customers.value.find((customer) => customer.id === customerId.value) ??
      null,
  )

  const isSignedIn = computed(() => current.value !== null)

  function commit(customer: Customer) {
    const index = customers.value.findIndex((entry) => entry.id === customer.id)
    if (index === -1) return
    const updated = [...customers.value]
    updated[index] = customer
    customers.value = updated
    persistCustomers(updated)
  }

  function requestMagicLink(emailInput: string): MagicLinkResult {
    const email = emailInput.trim().toLowerCase()
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { ok: false, error: 'Enter a valid email address.' }
    }

    const request: MagicLinkRequest = {
      email,
      token: createToken(),
      expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS).toISOString(),
    }
    magicLink.value = request
    persistMagicLink(request)
    return { ok: true }
  }

  function verifyMagicLink(token: string): MagicLinkResult {
    const request = magicLink.value
    if (!request || request.token !== token) {
      return { ok: false, error: 'This magic link is invalid or has expired.' }
    }
    if (Date.parse(request.expiresAt) < Date.now()) {
      magicLink.value = null
      persistMagicLink(null)
      return {
        ok: false,
        error: 'This magic link has expired. Request a new one.',
      }
    }

    magicLink.value = null
    persistMagicLink(null)

    const existing = customers.value.find(
      (customer) => customer.email === request.email,
    )
    const isNewCustomer = !existing

    let customer = existing
    if (!customer) {
      customer = {
        id: createId(),
        email: request.email,
        createdAt: new Date().toISOString(),
        orders: [],
        addresses: [],
        primaryAddressId: null,
        shippingAddressId: null,
        billingAddressId: null,
        notifications: { ...DEFAULT_NOTIFICATION_PREFS },
      }
      customers.value = [...customers.value, customer]
      persistCustomers(customers.value)
    }

    customerId.value = customer.id
    persistSession(customer.id)
    return { ok: true, isNewCustomer }
  }

  function signOut() {
    customerId.value = null
    persistSession(null)
  }

  function recordOrder(order: Order) {
    const customer = current.value
    if (!customer) return
    commit({
      ...customer,
      orders: [order, ...customer.orders],
    })
  }

  function addAddress(input: AddressInput): AddressResult {
    const customer = current.value
    if (!customer) {
      return { ok: false, error: 'Sign in to save an address.' }
    }

    const address: Address = {
      id: createId(),
      label: input.label?.trim() ?? '',
      name: input.name.trim(),
      addressLine1: input.addressLine1.trim(),
      addressLine2: input.addressLine2?.trim() ?? '',
      city: input.city.trim(),
      zip: input.zip.trim(),
      country: input.country.trim(),
    }

    const isFirst = customer.addresses.length === 0
    commit({
      ...customer,
      addresses: [...customer.addresses, address],
      primaryAddressId: isFirst ? address.id : customer.primaryAddressId,
      shippingAddressId: isFirst ? address.id : customer.shippingAddressId,
      billingAddressId: isFirst ? address.id : customer.billingAddressId,
    })
    return { ok: true }
  }

  function updateAddress(id: string, input: AddressInput): AddressResult {
    const customer = current.value
    if (!customer) {
      return { ok: false, error: 'Sign in to edit an address.' }
    }
    const existing = customer.addresses.find((address) => address.id === id)
    if (!existing) {
      return { ok: false, error: 'Address not found.' }
    }
    commit({
      ...customer,
      addresses: customer.addresses.map((address) =>
        address.id === id
          ? {
              ...address,
              label: input.label?.trim() ?? '',
              name: input.name.trim(),
              addressLine1: input.addressLine1.trim(),
              addressLine2: input.addressLine2?.trim() ?? '',
              city: input.city.trim(),
              zip: input.zip.trim(),
              country: input.country.trim(),
            }
          : address,
      ),
    })
    return { ok: true }
  }

  function removeAddress(id: string) {
    const customer = current.value
    if (!customer) return
    commit({
      ...customer,
      addresses: customer.addresses.filter((address) => address.id !== id),
      primaryAddressId:
        customer.primaryAddressId === id ? null : customer.primaryAddressId,
      shippingAddressId:
        customer.shippingAddressId === id ? null : customer.shippingAddressId,
      billingAddressId:
        customer.billingAddressId === id ? null : customer.billingAddressId,
    })
  }

  function setPrimaryAddress(id: string) {
    const customer = current.value
    if (!customer || !customer.addresses.some((a) => a.id === id)) return
    commit({ ...customer, primaryAddressId: id })
  }

  function setShippingAddress(id: string) {
    const customer = current.value
    if (!customer || !customer.addresses.some((a) => a.id === id)) return
    commit({ ...customer, shippingAddressId: id })
  }

  function setBillingAddress(id: string) {
    const customer = current.value
    if (!customer || !customer.addresses.some((a) => a.id === id)) return
    commit({ ...customer, billingAddressId: id })
  }

  function changeEmail(emailInput: string): AddressResult {
    const customer = current.value
    if (!customer) {
      return { ok: false, error: 'Sign in to change your email.' }
    }
    const email = emailInput.trim().toLowerCase()
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { ok: false, error: 'Enter a valid email address.' }
    }
    if (email === customer.email) {
      return { ok: false, error: 'That is already your email address.' }
    }
    const taken = customers.value.some(
      (entry) => entry.id !== customer.id && entry.email === email,
    )
    if (taken) {
      return {
        ok: false,
        error: 'That email is already used by another account.',
      }
    }
    commit({ ...customer, email })
    return { ok: true }
  }

  function updateNotificationPrefs(
    prefs: Partial<NotificationPrefs>,
  ): AddressResult {
    const customer = current.value
    if (!customer) {
      return { ok: false, error: 'Sign in to update preferences.' }
    }
    commit({
      ...customer,
      notifications: { ...customer.notifications, ...prefs },
    })
    return { ok: true }
  }

  return {
    customers,
    customerId,
    magicLink,
    current,
    isSignedIn,
    requestMagicLink,
    verifyMagicLink,
    signOut,
    recordOrder,
    addAddress,
    updateAddress,
    removeAddress,
    setPrimaryAddress,
    setShippingAddress,
    setBillingAddress,
    changeEmail,
    updateNotificationPrefs,
  }
})
