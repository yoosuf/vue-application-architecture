<script setup lang="ts">
import { reactive } from 'vue'
import { watch } from 'vue'
import * as stylex from '@stylexjs/stylex'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import TextField from '@vue-application-architecture/design-system/ui/atoms/TextField.vue'
import Drawer from '@vue-application-architecture/design-system/ui/molecules/Drawer.vue'
import FormSection from '@vue-application-architecture/design-system/ui/molecules/FormSection.vue'
import {
  colors,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCustomerStore, type Address } from '../stores/customer.store'

const props = defineProps<{
  open: boolean
  address: Address | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const customer = useCustomerStore()

const form = reactive({
  label: '',
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  zip: '',
  country: 'United States',
})

const errors = reactive({
  name: '',
  addressLine1: '',
  city: '',
  zip: '',
  form: '',
})

watch(
  () => props.open,
  (open) => {
    if (!open) return
    const address = props.address
    form.label = address?.label ?? ''
    form.name = address?.name ?? ''
    form.addressLine1 = address?.addressLine1 ?? ''
    form.addressLine2 = address?.addressLine2 ?? ''
    form.city = address?.city ?? ''
    form.zip = address?.zip ?? ''
    form.country = address?.country ?? 'United States'
    errors.name = ''
    errors.addressLine1 = ''
    errors.city = ''
    errors.zip = ''
    errors.form = ''
  },
  { immediate: true },
)

function setField(field: keyof typeof form, value: string) {
  form[field] = value
}

function submit() {
  errors.form = ''
  if (!form.name.trim()) {
    errors.name = 'Enter the name for this address.'
    return
  }
  if (!form.addressLine1.trim()) {
    errors.addressLine1 = 'Enter the street address.'
    return
  }
  if (!form.city.trim()) {
    errors.city = 'Enter the city.'
    return
  }
  if (!form.zip.trim()) {
    errors.zip = 'Enter the ZIP code.'
    return
  }

  const input = {
    label: form.label,
    name: form.name,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    city: form.city,
    zip: form.zip,
    country: form.country,
  }

  const result = props.address
    ? customer.updateAddress(props.address.id, input)
    : customer.addAddress(input)

  if (!result.ok) {
    errors.form = result.error ?? 'Unable to save this address.'
    return
  }

  emit('saved')
}

const styles = stylex.create({
  fields: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: spacing.md,
  },
  pair: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (max-width: 420px)': 'minmax(0, 1fr)',
    },
    gap: spacing.md,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  error: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.danger,
  },
})
</script>

<template>
  <Drawer
    :open="props.open"
    :title="props.address ? 'Edit Address' : 'Add Address'"
    @close="emit('close')"
  >
    <form @submit.prevent="submit" novalidate>
      <FormSection
        :legend="props.address ? 'Update the address' : 'Address details'"
      >
        <div v-bind="stylex.attrs(styles.fields)">
          <TextField
            :model-value="form.label"
            label="Label (optional)"
            placeholder="e.g. Home, Work"
            @update:model-value="setField('label', $event)"
          />
          <TextField
            :model-value="form.name"
            label="Full name"
            autocomplete="name"
            :error="errors.name"
            @update:model-value="setField('name', $event)"
          />
          <TextField
            :model-value="form.addressLine1"
            label="Street address"
            autocomplete="address-line1"
            :error="errors.addressLine1"
            @update:model-value="setField('addressLine1', $event)"
          />
          <TextField
            :model-value="form.addressLine2"
            label="Apartment, suite (optional)"
            autocomplete="address-line2"
            @update:model-value="setField('addressLine2', $event)"
          />
          <div v-bind="stylex.attrs(styles.pair)">
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
          </div>
          <TextField
            :model-value="form.country"
            label="Country"
            autocomplete="country-name"
            @update:model-value="setField('country', $event)"
          />
        </div>
      </FormSection>

      <p v-if="errors.form" v-bind="stylex.attrs(styles.error)" role="alert">
        {{ errors.form }}
      </p>
    </form>

    <template #footer>
      <div v-bind="stylex.attrs(styles.footer)">
        <AppButton variant="secondary" @click="emit('close')">Cancel</AppButton>
        <AppButton type="submit" @click="submit">
          {{ props.address ? 'Save Address' : 'Add Address' }}
        </AppButton>
      </div>
    </template>
  </Drawer>
</template>
