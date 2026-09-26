<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { LibraryBig } from 'lucide-vue-next'
import {
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from '../../styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    title: string
    message: string
    headingLevel?: 'h1' | 'h2' | 'h3'
  }>(),
  {
    headingLevel: 'h2',
  },
)

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xxxl,
    textAlign: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: radii.circle,
    backgroundColor: colors.surface,
    boxShadow: shadows.card,
  },
  icon: {
    display: 'flex',
    color: colors.accent,
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size2xl,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingTight,
    color: colors.textPrimary,
  },
  message: {
    maxWidth: '34ch',
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
    color: colors.textSecondary,
  },
  action: {
    marginTop: spacing.sm,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <span v-bind="stylex.attrs(styles.iconBadge)">
      <LibraryBig
        :size="40"
        v-bind="stylex.attrs(styles.icon)"
        aria-hidden="true"
      />
    </span>
    <component :is="props.headingLevel" v-bind="stylex.attrs(styles.title)">{{
      title
    }}</component>
    <p v-bind="stylex.attrs(styles.message)">{{ message }}</p>
    <div v-if="$slots.default" v-bind="stylex.attrs(styles.action)">
      <slot />
    </div>
  </div>
</template>
