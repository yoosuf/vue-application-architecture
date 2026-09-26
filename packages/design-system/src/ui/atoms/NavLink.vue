<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import type { RouteLocationRaw } from 'vue-router'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  spacing,
  typography,
} from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw
    label: string
  }>(),
  {},
)

const styles = stylex.create({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: spacing.sm,
    paddingBlock: '8px',
    borderRadius: radii.sm,
    color: colors.textSecondary,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    lineHeight: typography.leadingSnug,
    textDecoration: 'none',
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}`,
    '@media (max-width: 640px)': {
      paddingInline: spacing.xs,
    },
    ':hover': {
      color: colors.textPrimary,
      backgroundColor: colors.surfaceHover,
    },
  },
  active: {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    ':hover': {
      color: colors.accent,
      backgroundColor: colors.accentSoft,
    },
  },
})
</script>

<template>
  <RouterLink v-slot="{ href, navigate, isActive }" :to="props.to" custom>
    <a
      :href="href"
      :aria-current="isActive ? 'page' : undefined"
      v-bind="
        stylex.attrs(
          styles.link,
          isActive && styles.active,
          focusRing.visible,
          reducedMotion.root,
        )
      "
      @click="navigate"
    >
      {{ props.label }}
    </a>
  </RouterLink>
</template>
