<script setup lang="ts">
import { computed, reactive } from 'vue'
import * as stylex from '@stylexjs/stylex'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import TextField from '@vue-application-architecture/design-system/ui/atoms/TextField.vue'
import SectionHeading from '@vue-application-architecture/design-system/ui/atoms/SectionHeading.vue'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import FormSection from '@vue-application-architecture/design-system/ui/molecules/FormSection.vue'
import PageSection from '@vue-application-architecture/design-system/ui/molecules/PageSection.vue'
import { OrderSummary, useCartStore } from '../../cart'
import { formatCurrency } from '../../core'
import { useCheckoutStore } from '../stores/checkout.store'
import { useCustomerStore } from '../../customer'
import {
  colors,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

interface CheckoutForm {
  email: string
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  zip: string
  country: string
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
}

type FormField = keyof CheckoutForm

const cart = useCartStore()
const checkout = useCheckoutStore()
const customer = useCustomerStore()

const preferredShipTo = computed(() => {
  const current = customer.current
  if (!current || current.addresses.length === 0) return null
  return (
    current.addresses.find(
      (address) => address.id === current.shippingAddressId,
    ) ??
    current.addresses.find(
      (address) => address.id === current.primaryAddressId,
    ) ??
    null
  )
})

const form = reactive<CheckoutForm>({
  email: customer.current?.email ?? '',
  name: preferredShipTo.value?.name ?? '',
  addressLine1: preferredShipTo.value?.addressLine1 ?? '',
  addressLine2: preferredShipTo.value?.addressLine2 ?? '',
  city: preferredShipTo.value?.city ?? '',
  zip: preferredShipTo.value?.zip ?? '',
  country: preferredShipTo.value?.country ?? 'United States',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
})

const errors = reactive<Record<FormField, string>>({
  email: '',
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  zip: '',
  country: '',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
})

const messages: Record<FormField, string> = {
  email: 'Enter a valid email address.',
  name: 'Enter the name to ship to.',
  addressLine1: 'Enter your street address.',
  addressLine2: '',
  city: 'Enter your city.',
  zip: 'Enter your ZIP code.',
  country: 'Enter your country.',
  cardName: 'Enter the name on the card.',
  cardNumber: 'Enter your card number.',
  expiry: 'Enter the expiry date.',
  cvc: 'Enter the CVC.',
}

function setField(field: FormField, value: string) {
  form[field] = value
  errors[field] = ''
}

function validate(): boolean {
  let valid = true
  for (const field of Object.keys(errors) as FormField[]) {
    const value = form[field].trim()
    const error =
      field === 'addressLine2'
        ? ''
        : field === 'email'
          ? /\S+@\S+\.\S+/.test(value)
            ? ''
            : messages[field]
          : field === 'cardNumber'
            ? /^[\d ]{12,19}$/.test(value)
              ? ''
              : messages[field]
            : value.length > 0
              ? ''
              : messages[field]
    errors[field] = error
    if (error) valid = false
  }
  return valid
}

function placeOrder() {
  if (!validate()) return
  const order = checkout.placeOrder({
    email: form.email.trim(),
    name: form.name.trim(),
    addressLine1: form.addressLine1.trim(),
    addressLine2: form.addressLine2.trim(),
    city: form.city.trim(),
    zip: form.zip.trim(),
    country: form.country.trim(),
  })
  if (order) customer.recordOrder(order)
}

const order = computed(() => checkout.lastOrder)

const displayAddress = computed(() => {
  const current = order.value
  if (!current) return ''
  return [
    current.name,
    current.addressLine1,
    current.addressLine2,
    `${current.city}, ${current.zip}`,
    current.country,
  ]
    .filter(Boolean)
    .join('\n')
})

const styles = stylex.create({
  layout: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) minmax(280px, 360px)',
      '@media (max-width: 900px)': 'minmax(0, 1fr)',
    },
    gap: spacing.xl,
    alignItems: 'start',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  fields: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (max-width: 560px)': 'minmax(0, 1fr)',
    },
    gap: spacing.md,
  },
  full: {
    gridColumn: '1 / -1',
  },
  note: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    lineHeight: typography.leadingNormal,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  confirmation: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
  },
  orderNumber: {
    margin: 0,
    fontSize: typography.sizeLg,
    fontWeight: typography.weightBold,
    color: colors.accent,
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    fontSize: typography.sizeBase,
  },
  lineTitle: {
    fontWeight: typography.weightMedium,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    fontSize: typography.sizeBase,
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
</script>

<template>
  <PageSection layout="column" label="Checkout">
    <template v-if="order">
      <SectionHeading level="h1"
        >Thanks{{ order.name ? `, ${order.name.split(' ')[0]}` : '' }} — your
        order is in.</SectionHeading
      >

      <div v-bind="stylex.attrs(styles.confirmation)">
        <p v-bind="stylex.attrs(styles.orderNumber)">Order {{ order.id }}</p>
        <p v-if="customer.isSignedIn" v-bind="stylex.attrs(styles.note)">
          This order was saved to your account.
        </p>

        <div
          v-for="line in order.lines"
          :key="line.bookId"
          v-bind="stylex.attrs(styles.line)"
        >
          <span v-bind="stylex.attrs(styles.lineTitle)">
            {{ line.title }}
            <span v-bind="stylex.attrs(styles.note)">
              × {{ line.quantity }}
            </span>
          </span>
          <span>{{ formatCurrency(line.lineTotalCents) }}</span>
        </div>

        <div v-bind="stylex.attrs(styles.divider)" />

        <div v-bind="stylex.attrs(styles.row)">
          <span>Subtotal</span>
          <span>{{ formatCurrency(order.subtotalCents) }}</span>
        </div>
        <div v-bind="stylex.attrs(styles.row)">
          <span>Shipping</span>
          <span>{{
            order.shippingCents === 0
              ? 'Free'
              : formatCurrency(order.shippingCents)
          }}</span>
        </div>
        <div v-bind="stylex.attrs(styles.row, styles.total)">
          <span>Total</span>
          <span>{{ formatCurrency(order.totalCents) }}</span>
        </div>

        <div v-bind="stylex.attrs(styles.divider)" />

        <div>
          <SectionHeading level="h2" size="2xl">Ships to</SectionHeading>
          <p v-bind="stylex.attrs(styles.address)">{{ displayAddress }}</p>
        </div>

        <AppButton :to="{ name: 'explore' }" size="lg">
          Continue Exploring
        </AppButton>
      </div>
    </template>

    <EmptyState
      v-else-if="cart.lineCount === 0"
      heading-level="h1"
      title="Nothing to check out yet."
      message="Head back to the cart and add a few books to your order."
    >
      <AppButton :to="{ name: 'cart' }">View Your Cart</AppButton>
    </EmptyState>

    <template v-else>
      <SectionHeading level="h1">Checkout</SectionHeading>

      <form
        v-bind="stylex.attrs(styles.layout)"
        @submit.prevent="placeOrder"
        novalidate
      >
        <div v-bind="stylex.attrs(styles.form)">
          <FormSection legend="Contact">
            <div v-bind="stylex.attrs(styles.fields)">
              <div v-bind="stylex.attrs(styles.full)">
                <TextField
                  :model-value="form.email"
                  label="Email"
                  type="email"
                  autocomplete="email"
                  :error="errors.email"
                  placeholder="you@example.com"
                  @update:model-value="setField('email', $event)"
                />
              </div>
            </div>
          </FormSection>

          <FormSection legend="Shipping">
            <div v-bind="stylex.attrs(styles.fields)">
              <div v-bind="stylex.attrs(styles.full)">
                <TextField
                  :model-value="form.name"
                  label="Full name"
                  autocomplete="name"
                  :error="errors.name"
                  @update:model-value="setField('name', $event)"
                />
              </div>
              <div v-bind="stylex.attrs(styles.full)">
                <TextField
                  :model-value="form.addressLine1"
                  label="Street address"
                  autocomplete="address-line1"
                  :error="errors.addressLine1"
                  @update:model-value="setField('addressLine1', $event)"
                />
              </div>
              <div v-bind="stylex.attrs(styles.full)">
                <TextField
                  :model-value="form.addressLine2"
                  label="Apartment, suite (optional)"
                  autocomplete="address-line2"
                  @update:model-value="setField('addressLine2', $event)"
                />
              </div>
              <TextField
                :model-value="form.city"
                label="City"
                autocomplete="address-level2"
                :error="errors.city"
                @update:model-value="setField('city', $event)"
              />
              <TextField
                :model-value="form.zip"
                label="ZIP"
                autocomplete="postal-code"
                :error="errors.zip"
                @update:model-value="setField('zip', $event)"
              />
              <div v-bind="stylex.attrs(styles.full)">
                <TextField
                  :model-value="form.country"
                  label="Country"
                  autocomplete="country-name"
                  :error="errors.country"
                  @update:model-value="setField('country', $event)"
                />
              </div>
            </div>
          </FormSection>

          <FormSection legend="Payment">
            <div v-bind="stylex.attrs(styles.fields)">
              <div v-bind="stylex.attrs(styles.full)">
                <TextField
                  :model-value="form.cardName"
                  label="Name on card"
                  autocomplete="cc-name"
                  :error="errors.cardName"
                  @update:model-value="setField('cardName', $event)"
                />
              </div>
              <div v-bind="stylex.attrs(styles.full)">
                <TextField
                  :model-value="form.cardNumber"
                  label="Card number"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  :error="errors.cardNumber"
                  @update:model-value="setField('cardNumber', $event)"
                />
              </div>
              <TextField
                :model-value="form.expiry"
                label="Expiry"
                inputmode="numeric"
                autocomplete="cc-exp"
                placeholder="MM / YY"
                :error="errors.expiry"
                @update:model-value="setField('expiry', $event)"
              />
              <TextField
                :model-value="form.cvc"
                label="CVC"
                type="password"
                inputmode="numeric"
                autocomplete="cc-csc"
                placeholder="123"
                :error="errors.cvc"
                @update:model-value="setField('cvc', $event)"
              />
            </div>
            <p v-bind="stylex.attrs(styles.note)">
              Demo checkout — no real payment is processed and no card data is
              saved.
            </p>
          </FormSection>
        </div>

        <div v-bind="stylex.attrs(styles.sidebar)">
          <OrderSummary />
          <AppButton type="submit" size="lg">Place Order</AppButton>
          <AppButton variant="secondary" :to="{ name: 'cart' }">
            Back to Cart
          </AppButton>
        </div>
      </form>
    </template>
  </PageSection>
</template>
