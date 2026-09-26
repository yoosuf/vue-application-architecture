<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as stylex from '@stylexjs/stylex'
import {
  Heart,
  LogOut,
  MapPin,
  Pencil,
  ShoppingBag,
  Trash2,
  UserCog,
  UserRound,
} from 'lucide-vue-next'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import IconButton from '@vue-application-architecture/design-system/ui/atoms/IconButton.vue'
import SectionHeading from '@vue-application-architecture/design-system/ui/atoms/SectionHeading.vue'
import TextButton from '@vue-application-architecture/design-system/ui/atoms/TextButton.vue'
import TextField from '@vue-application-architecture/design-system/ui/atoms/TextField.vue'
import Toggle from '@vue-application-architecture/design-system/ui/atoms/Toggle.vue'
import { focusRing } from '../../../../../../packages/design-system/src/styles/shared.stylex'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import PageSection from '@vue-application-architecture/design-system/ui/molecules/PageSection.vue'
import AddressForm from '../components/AddressForm.vue'
import { BookCover, BookGrid, useCatalogStore } from '../../catalog'
import { AddToCartButton, formatPrice } from '../../cart'
import { FavoriteButton, useFavoritesStore } from '../../favorites'
import type { Order } from '../../checkout'
import { useCustomerStore, type Address } from '../stores/customer.store'
import {
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const customer = useCustomerStore()
const router = useRouter()
const route = useRoute()
const catalog = useCatalogStore()
const favorites = useFavoritesStore()

type AccountSection =
  'orders' | 'profile' | 'favorites' | 'account' | 'addresses'

const activeSection = computed<AccountSection>(() => {
  switch (route.name) {
    case 'account-orders':
      return 'orders'
    case 'account-profile':
      return 'profile'
    case 'account-favorites':
      return 'favorites'
    case 'account-settings':
      return 'account'
    case 'account-addresses':
      return 'addresses'
    default:
      return 'orders'
  }
})
const addressDrawerOpen = ref(false)
const editingAddress = ref<Address | null>(null)

const account = computed(() => customer.current)
const addresses = computed(() => account.value?.addresses ?? [])
const orders = computed(() => customer.current?.orders ?? [])
const firstName = computed(() => {
  const local = account.value?.email.split('@')[0] ?? ''
  return local ? `${local[0].toUpperCase()}${local.slice(1)}` : ''
})
const memberSince = computed(() => {
  const created = account.value?.createdAt
  if (!created) return ''
  return new Date(created).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  })
})
const orderCountLabel = computed(() => {
  const count = orders.value.length
  return `${count} ${count === 1 ? 'order' : 'orders'}`
})

const emailForm = reactive({
  value: '',
  error: '',
  saved: false,
})

watch(
  () => route.name,
  (name) => {
    if (name !== 'account-settings') return
    emailForm.value = account.value?.email ?? ''
    emailForm.error = ''
    emailForm.saved = false
  },
)

function saveEmail() {
  emailForm.saved = false
  const result = customer.changeEmail(emailForm.value)
  if (!result.ok) {
    emailForm.error = result.error ?? 'Unable to update your email.'
    return
  }
  emailForm.error = ''
  emailForm.value = customer.current?.email ?? ''
  emailForm.saved = true
}

const orderUpdatesPref = computed({
  get: () => account.value?.notifications.orderUpdates ?? true,
  set: (value: boolean) =>
    customer.updateNotificationPrefs({ orderUpdates: value }),
})

const recommendationsPref = computed({
  get: () => account.value?.notifications.recommendations ?? false,
  set: (value: boolean) =>
    customer.updateNotificationPrefs({ recommendations: value }),
})

const newsAndDealsPref = computed({
  get: () => account.value?.notifications.newsAndDeals ?? false,
  set: (value: boolean) =>
    customer.updateNotificationPrefs({ newsAndDeals: value }),
})

function formatOrderDate(placedAt: string): string {
  return new Date(placedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function coverUrlFor(bookId: string): string | undefined {
  return catalog.findBookById(bookId)?.coverUrl
}

function initialsFor(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase()
}

function itemCount(order: Order): number {
  return order.lines.reduce((total, line) => total + line.quantity, 0)
}

function isPrimary(addressId: string): boolean {
  return account.value?.primaryAddressId === addressId
}

function isShipping(addressId: string): boolean {
  return account.value?.shippingAddressId === addressId
}

function isBilling(addressId: string): boolean {
  return account.value?.billingAddressId === addressId
}

function openNewAddress() {
  editingAddress.value = null
  addressDrawerOpen.value = true
}

function openEditAddress(address: Address) {
  editingAddress.value = address
  addressDrawerOpen.value = true
}

function closeAddressForm() {
  addressDrawerOpen.value = false
}

function onAddressSaved() {
  addressDrawerOpen.value = false
}

function removeAddress(address: Address) {
  customer.removeAddress(address.id)
}

function addressLines(address: Address): string {
  return [
    address.name,
    address.addressLine1,
    address.addressLine2,
    `${address.city}, ${address.zip}`,
    address.country,
  ]
    .filter(Boolean)
    .join('\n')
}

function signOut() {
  customer.signOut()
  router.push({ name: 'explore' })
}

const styles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  accountLayout: {
    display: 'grid',
    gridTemplateColumns: {
      default: '220px minmax(0, 1fr)',
      '@media (max-width: 860px)': 'minmax(0, 1fr)',
    },
    gap: spacing.lg,
    alignItems: 'start',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xxs,
    padding: spacing.xxs,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    '@media (max-width: 860px)': {
      flexDirection: 'row',
      overflowX: 'auto',
    },
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    textAlign: 'left',
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    borderRadius: radii.sm,
    border: 'none',
    background: 'none',
    fontSize: typography.sizeBase,
    color: colors.textSecondary,
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ':hover': {
      color: colors.textPrimary,
    },
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    textAlign: 'left',
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    borderRadius: radii.sm,
    border: 'none',
    background: colors.accentSoft,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.accent,
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ':hover': {
      color: colors.accent,
    },
  },
  navLogoutWrap: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTop: `1px solid ${colors.border}`,
    '@media (max-width: 860px)': {
      marginTop: 0,
      paddingTop: 0,
      borderTop: 'none',
      borderLeft: `1px solid ${colors.border}`,
      paddingLeft: spacing.xs,
    },
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    textAlign: 'left',
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    borderRadius: radii.sm,
    border: 'none',
    background: 'none',
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.danger,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: colors.surfaceHover,
    },
  },
  content: {
    minWidth: 0,
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    boxShadow: shadows.card,
  },
  meta: {
    margin: 0,
    fontSize: typography.sizeBase,
    color: colors.textSecondary,
  },
  infoText: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  success: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.accent,
  },
  emailField: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    alignItems: 'flex-start',
    maxWidth: 360,
  },
  prefList: {
    display: 'flex',
    flexDirection: 'column',
  },
  prefItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    paddingBlock: spacing.md,
  },
  prefDesc: {
    margin: 0,
    fontSize: typography.sizeSm,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  chips: {
    display: 'flex',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  chip: {
    paddingInline: spacing.sm,
    paddingBlock: '4px',
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceHover,
    borderRadius: radii.circle,
  },
  ordersSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  addressesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(auto-fill, minmax(250px, 1fr))',
      '@media (max-width: 560px)': 'minmax(0, 1fr)',
    },
    gap: spacing.md,
  },
  addressCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    boxShadow: shadows.card,
  },
  cardHead: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cardLabel: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  badges: {
    display: 'flex',
    gap: spacing.xxs,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  badge: {
    paddingInline: spacing.sm,
    paddingBlock: '2px',
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceHover,
    borderRadius: radii.circle,
  },
  badgePrimary: {
    paddingInline: spacing.sm,
    paddingBlock: '2px',
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.circle,
  },
  addressText: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
    whiteSpace: 'pre-line',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  emptyAddresses: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    border: `1px dashed ${colors.border}`,
    borderRadius: radii.md,
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  sectionHeadRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardActionSpacer: {
    flex: 1,
  },
  resultCount: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  order: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    boxShadow: shadows.card,
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  orderId: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  orderDate: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  line: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: spacing.md,
    fontSize: typography.sizeBase,
  },
  lineCoverWrap: {
    width: 40,
    flexShrink: 0,
  },
  coverPlaceholder: {
    width: 40,
    aspectRatio: '2 / 3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.sizeSm,
    fontWeight: typography.weightBold,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceHover,
    borderRadius: radii.sm,
  },
  lineBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  lineTitle: {
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  lineQty: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  lineAmount: {
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    whiteSpace: 'nowrap',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    fontSize: typography.sizeBase,
    color: colors.textPrimary,
  },
  rowValue: {
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  total: {
    fontSize: typography.sizeLg,
    fontWeight: typography.weightBold,
  },
  address: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
    whiteSpace: 'pre-line',
  },
})

function orderAddress(order: {
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  zip: string
  country: string
}): string {
  return [
    order.name,
    order.addressLine1,
    order.addressLine2,
    `${order.city}, ${order.zip}`,
    order.country,
  ]
    .filter(Boolean)
    .join('\n')
}
</script>

<template>
  <PageSection layout="column" label="Your account">
    <template v-if="account">
      <div v-bind="stylex.attrs(styles.header)">
        <SectionHeading level="h1">Hello, {{ firstName }}</SectionHeading>
        <p v-bind="stylex.attrs(styles.meta)">{{ account.email }}</p>
      </div>

      <div v-bind="stylex.attrs(styles.accountLayout)">
        <nav v-bind="stylex.attrs(styles.nav)" aria-label="Account">
          <router-link
            :to="{ name: 'account-orders' }"
            v-bind="
              stylex.attrs(
                activeSection === 'orders'
                  ? styles.navItemActive
                  : styles.navItem,
              )
            "
            :aria-current="activeSection === 'orders' ? 'page' : undefined"
          >
            <ShoppingBag :size="18" aria-hidden="true" />
            Orders
          </router-link>
          <router-link
            :to="{ name: 'account-profile' }"
            v-bind="
              stylex.attrs(
                activeSection === 'profile'
                  ? styles.navItemActive
                  : styles.navItem,
              )
            "
            :aria-current="activeSection === 'profile' ? 'page' : undefined"
          >
            <UserRound :size="18" aria-hidden="true" />
            Profile
          </router-link>
          <router-link
            :to="{ name: 'account-favorites' }"
            v-bind="
              stylex.attrs(
                activeSection === 'favorites'
                  ? styles.navItemActive
                  : styles.navItem,
              )
            "
            :aria-current="activeSection === 'favorites' ? 'page' : undefined"
          >
            <Heart :size="18" aria-hidden="true" />
            Favorites
          </router-link>
          <router-link
            :to="{ name: 'account-settings' }"
            v-bind="
              stylex.attrs(
                activeSection === 'account'
                  ? styles.navItemActive
                  : styles.navItem,
              )
            "
            :aria-current="activeSection === 'account' ? 'page' : undefined"
          >
            <UserCog :size="18" aria-hidden="true" />
            Account
          </router-link>
          <router-link
            :to="{ name: 'account-addresses' }"
            v-bind="
              stylex.attrs(
                activeSection === 'addresses'
                  ? styles.navItemActive
                  : styles.navItem,
              )
            "
            :aria-current="activeSection === 'addresses' ? 'page' : undefined"
          >
            <MapPin :size="18" aria-hidden="true" />
            Addresses
          </router-link>
          <div v-bind="stylex.attrs(styles.navLogoutWrap)">
            <button
              type="button"
              v-bind="stylex.attrs(styles.logoutButton, focusRing.visible)"
              @click="signOut"
            >
              <LogOut :size="18" aria-hidden="true" />
              Log out
            </button>
          </div>
        </nav>

        <div v-bind="stylex.attrs(styles.content)">
          <div
            v-if="activeSection === 'orders'"
            v-bind="stylex.attrs(styles.ordersSection)"
          >
            <template v-if="orders.length > 0">
              <div v-bind="stylex.attrs(styles.sectionHead)">
                <SectionHeading level="h2">Order History</SectionHeading>
                <p v-bind="stylex.attrs(styles.resultCount)">Purchased books</p>
              </div>

              <article
                v-for="order in orders"
                :key="order.id"
                v-bind="stylex.attrs(styles.order)"
                :aria-label="`Order ${order.id}`"
              >
                <div v-bind="stylex.attrs(styles.orderHeader)">
                  <p v-bind="stylex.attrs(styles.orderId)">
                    Order {{ order.id }}
                  </p>
                  <p v-bind="stylex.attrs(styles.orderDate)">
                    {{ formatOrderDate(order.placedAt) }} ·
                    {{ itemCount(order) }}
                    {{ itemCount(order) === 1 ? 'item' : 'items' }}
                  </p>
                </div>

                <ul v-bind="stylex.attrs(styles.lines)">
                  <li
                    v-for="line in order.lines"
                    :key="line.bookId"
                    v-bind="stylex.attrs(styles.line)"
                  >
                    <span v-bind="stylex.attrs(styles.lineCoverWrap)">
                      <BookCover
                        v-if="coverUrlFor(line.bookId)"
                        :src="coverUrlFor(line.bookId) ?? ''"
                        :alt="`Cover of ${line.title}`"
                      />
                      <span
                        v-else
                        v-bind="stylex.attrs(styles.coverPlaceholder)"
                        aria-hidden="true"
                      >
                        {{ initialsFor(line.title) }}
                      </span>
                    </span>

                    <span v-bind="stylex.attrs(styles.lineBody)">
                      <span v-bind="stylex.attrs(styles.lineTitle)">
                        {{ line.title }}
                      </span>
                      <span v-bind="stylex.attrs(styles.lineQty)">
                        × {{ line.quantity }}
                      </span>
                    </span>

                    <span v-bind="stylex.attrs(styles.lineAmount)">{{
                      formatPrice(line.lineTotalCents)
                    }}</span>
                  </li>
                </ul>

                <div v-bind="stylex.attrs(styles.divider)" />

                <div v-bind="stylex.attrs(styles.row)">
                  <span>Subtotal</span>
                  <span v-bind="stylex.attrs(styles.rowValue)">{{
                    formatPrice(order.subtotalCents)
                  }}</span>
                </div>
                <div v-bind="stylex.attrs(styles.row)">
                  <span>Shipping</span>
                  <span v-bind="stylex.attrs(styles.rowValue)">{{
                    order.shippingCents === 0
                      ? 'Free'
                      : formatPrice(order.shippingCents)
                  }}</span>
                </div>
                <div v-bind="stylex.attrs(styles.row, styles.total)">
                  <span>Total</span>
                  <span v-bind="stylex.attrs(styles.rowValue, styles.total)">
                    {{ formatPrice(order.totalCents) }}
                  </span>
                </div>

                <div v-bind="stylex.attrs(styles.divider)" />

                <div>
                  <SectionHeading level="h3" size="2xl"
                    >Shipped to</SectionHeading
                  >
                  <p v-bind="stylex.attrs(styles.address)">
                    {{ orderAddress(order) }}
                  </p>
                </div>
              </article>
            </template>

            <EmptyState
              v-else
              heading-level="h2"
              title="No orders yet."
              message="When you place an order it will show up here."
            >
              <AppButton :to="{ name: 'explore' }">Explore Books</AppButton>
            </EmptyState>
          </div>

          <div
            v-else-if="activeSection === 'favorites'"
            v-bind="stylex.attrs(styles.ordersSection)"
          >
            <template v-if="favorites.count > 0">
              <div v-bind="stylex.attrs(styles.sectionHead)">
                <SectionHeading level="h2">Favorites</SectionHeading>
                <p v-bind="stylex.attrs(styles.resultCount)" role="status">
                  {{ favorites.count }}
                  {{ favorites.count === 1 ? 'book saved' : 'books saved' }}
                </p>
              </div>

              <BookGrid :books="favorites.favoriteBooks">
                <template #footer="{ book }">
                  <FavoriteButton :book="book" />
                  <AddToCartButton :book="book" />
                </template>
              </BookGrid>
            </template>

            <EmptyState
              v-else
              heading-level="h2"
              title="No favorites yet."
              message="Explore books and save the ones you want to revisit."
            >
              <AppButton :to="{ name: 'explore' }">Explore Books</AppButton>
            </EmptyState>
          </div>

          <div
            v-else-if="activeSection === 'profile'"
            v-bind="stylex.attrs(styles.ordersSection)"
          >
            <div v-bind="stylex.attrs(styles.sectionHead)">
              <SectionHeading level="h2">Profile</SectionHeading>
              <p v-bind="stylex.attrs(styles.resultCount)">Your details</p>
            </div>

            <div v-bind="stylex.attrs(styles.profile)">
              <p v-bind="stylex.attrs(styles.meta)">{{ account.email }}</p>
              <p v-bind="stylex.attrs(styles.infoText)">
                Signed in with your email. Shelf never stores a password — you
                stay signed in on this device until you log out.
              </p>
              <div v-bind="stylex.attrs(styles.chips)">
                <span v-if="memberSince" v-bind="stylex.attrs(styles.chip)"
                  >Member since {{ memberSince }}</span
                >
                <span v-bind="stylex.attrs(styles.chip)">{{
                  orderCountLabel
                }}</span>
              </div>
            </div>
          </div>

          <div
            v-else-if="activeSection === 'account'"
            v-bind="stylex.attrs(styles.ordersSection)"
          >
            <div v-bind="stylex.attrs(styles.sectionHead)">
              <SectionHeading level="h2">Account</SectionHeading>
              <p v-bind="stylex.attrs(styles.resultCount)">
                Passwordless details
              </p>
            </div>

            <div v-bind="stylex.attrs(styles.profile)">
              <SectionHeading level="h3" size="2xl"
                >No password needed</SectionHeading
              >
              <p v-bind="stylex.attrs(styles.infoText)">
                Shelf accounts are passwordless. To sign in you just enter your
                email and we send you a magic link — click it once to get into
                your account. There is no password to set, remember, or reset.
              </p>
              <p v-bind="stylex.attrs(styles.infoText)">
                Magic links expire 15 minutes after they're requested. Request a
                new one any time from the Log In page.
              </p>
            </div>

            <div v-bind="stylex.attrs(styles.profile)">
              <SectionHeading level="h3" size="2xl"
                >Email address</SectionHeading
              >
              <p v-bind="stylex.attrs(styles.infoText)">
                Your sign-in and order notifications go to this address.
              </p>
              <div v-bind="stylex.attrs(styles.emailField)">
                <TextField
                  :model-value="emailForm.value"
                  label="Email"
                  type="email"
                  autocomplete="email"
                  :error="emailForm.error"
                  @update:model-value="emailForm.value = $event"
                />
                <AppButton size="sm" @click="saveEmail">Save</AppButton>
                <p
                  v-if="emailForm.saved"
                  v-bind="stylex.attrs(styles.success)"
                  role="status"
                >
                  Email updated.
                </p>
              </div>
            </div>

            <div v-bind="stylex.attrs(styles.profile)">
              <SectionHeading level="h3" size="2xl"
                >Notifications</SectionHeading
              >
              <p v-bind="stylex.attrs(styles.infoText)">
                Choose what we email you about. You can change these any time.
              </p>
              <div v-bind="stylex.attrs(styles.prefList)">
                <div v-bind="stylex.attrs(styles.prefItem)">
                  <Toggle
                    label="Order status"
                    v-model:checked="orderUpdatesPref"
                  />
                  <p v-bind="stylex.attrs(styles.prefDesc)">
                    Order confirmations and updates about your orders.
                  </p>
                </div>
                <div v-bind="stylex.attrs(styles.divider)" />
                <div v-bind="stylex.attrs(styles.prefItem)">
                  <Toggle
                    label="Recommendations"
                    v-model:checked="recommendationsPref"
                  />
                  <p v-bind="stylex.attrs(styles.prefDesc)">
                    Hand-picked books based on what you've bought and saved.
                  </p>
                </div>
                <div v-bind="stylex.attrs(styles.divider)" />
                <div v-bind="stylex.attrs(styles.prefItem)">
                  <Toggle
                    label="News and deals"
                    v-model:checked="newsAndDealsPref"
                  />
                  <p v-bind="stylex.attrs(styles.prefDesc)">
                    New arrivals, sales and limited-time offers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-else v-bind="stylex.attrs(styles.addressesSection)">
            <div v-bind="stylex.attrs(styles.sectionHead)">
              <SectionHeading level="h2">Addresses</SectionHeading>
              <div v-bind="stylex.attrs(styles.sectionHeadRight)">
                <p v-bind="stylex.attrs(styles.resultCount)">
                  {{ addresses.length }}
                  {{ addresses.length === 1 ? 'address' : 'addresses' }}
                </p>
                <AppButton
                  size="sm"
                  variant="secondary"
                  @click="openNewAddress"
                >
                  Add Address
                </AppButton>
              </div>
            </div>

            <div
              v-if="addresses.length > 0"
              v-bind="stylex.attrs(styles.addressGrid)"
            >
              <article
                v-for="address in addresses"
                :key="address.id"
                v-bind="stylex.attrs(styles.addressCard)"
                :aria-label="address.label || 'Address'"
              >
                <div v-bind="stylex.attrs(styles.cardHead)">
                  <p v-bind="stylex.attrs(styles.cardLabel)">
                    {{ address.label || 'Address' }}
                  </p>
                  <div v-bind="stylex.attrs(styles.badges)">
                    <span
                      v-if="isPrimary(address.id)"
                      v-bind="stylex.attrs(styles.badgePrimary)"
                      >Primary</span
                    >
                    <span
                      v-if="isShipping(address.id)"
                      v-bind="stylex.attrs(styles.badge)"
                      >Shipping</span
                    >
                    <span
                      v-if="isBilling(address.id)"
                      v-bind="stylex.attrs(styles.badge)"
                      >Billing</span
                    >
                  </div>
                </div>

                <p v-bind="stylex.attrs(styles.addressText)">
                  {{ addressLines(address) }}
                </p>

                <div v-bind="stylex.attrs(styles.cardActions)">
                  <TextButton
                    v-if="!isPrimary(address.id)"
                    type="button"
                    @click="customer.setPrimaryAddress(address.id)"
                  >
                    Make primary
                  </TextButton>
                  <TextButton
                    v-if="!isShipping(address.id)"
                    type="button"
                    @click="customer.setShippingAddress(address.id)"
                  >
                    Use for shipping
                  </TextButton>
                  <TextButton
                    v-if="!isBilling(address.id)"
                    type="button"
                    @click="customer.setBillingAddress(address.id)"
                  >
                    Use for billing
                  </TextButton>
                  <span v-bind="stylex.attrs(styles.cardActionSpacer)" />
                  <IconButton
                    :label="`Edit ${address.label || 'address'}`"
                    @click="openEditAddress(address)"
                  >
                    <Pencil :size="16" aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    :label="`Remove ${address.label || 'address'}`"
                    @click="removeAddress(address)"
                  >
                    <Trash2 :size="16" aria-hidden="true" />
                  </IconButton>
                </div>
              </article>
            </div>

            <p v-else v-bind="stylex.attrs(styles.emptyAddresses)">
              No saved addresses yet. Add one and it will speed up checkout.
            </p>
          </div>
        </div>
      </div>

      <AddressForm
        :open="addressDrawerOpen"
        :address="editingAddress"
        @close="closeAddressForm"
        @saved="onAddressSaved"
      />
    </template>
  </PageSection>
</template>
