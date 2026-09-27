<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { focusRing } from '../../styles/shared.stylex'
import { colors, radii, spacing, typography } from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    targetId?: string
    label?: string
  }>(),
  {
    targetId: 'main-content',
    label: 'Skip to content',
  },
)

function skipToContent() {
  const target = document.getElementById(props.targetId)
  target?.focus()
  target?.scrollIntoView()
}

const styles = stylex.create({
  skipLink: {
    position: 'fixed',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 20,
    padding: '8px 16px',
    borderRadius: radii.sm,
    backgroundColor: colors.accent,
    color: colors.textOnAccent,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
    textDecoration: 'none',
    transform: 'translateY(-200%)',
    ':focus-visible': {
      transform: 'translateY(0)',
    },
  },
})
</script>

<template>
  <a
    :href="`#${props.targetId}`"
    v-bind="stylex.attrs(styles.skipLink, focusRing.visible)"
    @click.prevent="skipToContent"
  >
    {{ props.label }}
  </a>
</template>
