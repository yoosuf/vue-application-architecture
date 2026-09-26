<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as stylex from '@stylexjs/stylex'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import SectionHeading from '@vue-application-architecture/design-system/ui/atoms/SectionHeading.vue'
import PageSection from '@vue-application-architecture/design-system/ui/molecules/PageSection.vue'
import {
  colors,
  radii,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCustomerStore } from '../stores/customer.store'

const customer = useCustomerStore()
const route = useRoute()
const router = useRouter()

const error = ref('')

onMounted(() => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''

  if (!token) {
    error.value = 'This magic link is missing a token. Request a new one.'
    return
  }

  const result = customer.verifyMagicLink(token)
  if (!result.ok) {
    error.value = result.error ?? 'This magic link is invalid.'
    return
  }

  router.replace({ name: 'account-orders' })
})

const styles = stylex.create({
  card: {
    maxWidth: '480px',
    margin: '0 auto',
    width: '100%',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  message: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.danger,
  },
  pending: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
})
</script>

<template>
  <PageSection layout="column" label="Signing you in">
    <div v-bind="stylex.attrs(styles.card)">
      <SectionHeading level="h1">Signing you in</SectionHeading>

      <p v-if="error" v-bind="stylex.attrs(styles.message)" role="alert">
        {{ error }}
      </p>
      <p v-else v-bind="stylex.attrs(styles.pending)">
        Verifying your magic link…
      </p>

      <AppButton v-if="error" :to="{ name: 'login' }"
        >Request a new link</AppButton
      >
    </div>
  </PageSection>
</template>
