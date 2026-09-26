<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { Mail, Zap } from 'lucide-vue-next'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import SectionHeading from '@vue-application-architecture/design-system/ui/atoms/SectionHeading.vue'
import TextButton from '@vue-application-architecture/design-system/ui/atoms/TextButton.vue'
import TextField from '@vue-application-architecture/design-system/ui/atoms/TextField.vue'
import PageSection from '@vue-application-architecture/design-system/ui/molecules/PageSection.vue'
import {
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCustomerStore } from '../stores/customer.store'

const customer = useCustomerStore()

const email = ref('')
const error = ref('')
const sent = ref(false)

const sentTo = computed(() => customer.magicLink?.email ?? '')
const linkToken = computed(() => customer.magicLink?.token ?? '')

onMounted(async () => {
  await nextTick()
  document
    .querySelector<HTMLInputElement>('input[autocomplete="email"]')
    ?.focus()
})

function sendMagicLink() {
  error.value = ''
  const result = customer.requestMagicLink(email.value)
  if (!result.ok) {
    error.value = result.error ?? 'Unable to send a magic link.'
    return
  }
  sent.value = true
}

function resend() {
  email.value = sentTo.value
  sendMagicLink()
}

function changeEmail() {
  sent.value = false
  email.value = sentTo.value
  error.value = ''
}

const styles = stylex.create({
  layout: {
    maxWidth: '440px',
    margin: '0 auto',
    width: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    boxShadow: shadows.card,
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  introTitle: {
    margin: 0,
    fontSize: typography.sizeXl,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  introText: {
    margin: 0,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  mailBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: radii.circle,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  formButton: {
    marginTop: spacing.lg,
  },
  sentEmail: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  emailPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceHover,
    borderRadius: radii.md,
    border: `1px solid ${colors.border}`,
  },
  previewHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  previewFrom: {
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
  },
  previewSubject: {
    margin: 0,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  note: {
    margin: 0,
    fontSize: typography.sizeSm,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
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
  <PageSection layout="column" label="Log in">
    <div v-bind="stylex.attrs(styles.layout)">
      <div v-bind="stylex.attrs(styles.card)">
        <template v-if="!sent">
          <div v-bind="stylex.attrs(styles.intro)">
            <SectionHeading level="h1">Log In</SectionHeading>
            <p v-bind="stylex.attrs(styles.introText)">
              Enter your email and we'll send you a magic link. New to Shelf?
              You'll get an account automatically — no passwords, ever.
            </p>
          </div>

          <form @submit.prevent="sendMagicLink" novalidate>
            <TextField
              v-model="email"
              label="Email address"
              type="email"
              autocomplete="email"
              :error="error"
              placeholder="you@example.com"
            />
            <div v-bind="stylex.attrs(styles.formButton)">
              <AppButton type="submit" size="lg">Continue</AppButton>
            </div>
          </form>
        </template>

        <template v-else>
          <div v-bind="stylex.attrs(styles.intro)">
            <span v-bind="stylex.attrs(styles.mailBadge)" aria-hidden="true">
              <Mail :size="24" stroke-width="1.75" />
            </span>
            <SectionHeading level="h1">Check your email</SectionHeading>
            <p v-bind="stylex.attrs(styles.sentEmail)">{{ sentTo }}</p>
          </div>

          <p v-bind="stylex.attrs(styles.introText)">
            We sent a magic link to that address. Open it and you'll be signed
            in automatically.
          </p>

          <div v-bind="stylex.attrs(styles.emailPreview)">
            <div v-bind="stylex.attrs(styles.previewHeader)">
              <p v-bind="stylex.attrs(styles.previewFrom)">
                From Shelf &lt;no-reply@shelf.example&gt;
              </p>
              <p v-bind="stylex.attrs(styles.previewSubject)">
                Your sign-in link
              </p>
            </div>
            <AppButton
              :to="{ name: 'login-verify', query: { token: linkToken } }"
              size="lg"
            >
              <Zap :size="18" aria-hidden="true" stroke-width="2" />
              Open the magic link
            </AppButton>
          </div>

          <div v-bind="stylex.attrs(styles.actions)">
            <TextButton type="button" @click="resend">
              Didn't get the email? Resend
            </TextButton>
            <TextButton type="button" @click="changeEmail">
              Use a different email
            </TextButton>
          </div>

          <p v-bind="stylex.attrs(styles.note)">
            Demo store — no real email is sent. The preview above is how the
            email would look.
          </p>

          <p v-if="error" v-bind="stylex.attrs(styles.error)" role="alert">
            {{ error }}
          </p>
        </template>
      </div>
    </div>
  </PageSection>
</template>
