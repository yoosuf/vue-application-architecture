<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { ChevronRight } from 'lucide-vue-next'
import type { RouteLocationRaw } from 'vue-router'
import { focusRing, reducedMotion } from '../../styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  spacing,
  typography,
} from '../../styles/tokens.stylex'

type BreadcrumbItem = {
  label: string
  to?: RouteLocationRaw
}

const props = withDefaults(
  defineProps<{
    items: readonly BreadcrumbItem[]
    label?: string
  }>(),
  {
    label: 'Breadcrumbs',
  },
)

const styles = stylex.create({
  list: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xxs,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    fontSize: typography.sizeSm,
    lineHeight: typography.leadingSnug,
  },
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingBlock: '2px',
    borderRadius: radii.sm,
    color: colors.textSecondary,
    textDecoration: 'none',
    transition: `color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      color: colors.accent,
      textDecorationLine: 'underline',
    },
  },
  current: {
    maxWidth: '28ch',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: colors.textPrimary,
    fontWeight: typography.weightMedium,
  },
  separator: {
    display: 'flex',
    color: colors.borderStrong,
  },
})
</script>

<template>
  <nav :aria-label="props.label">
    <ol v-bind="stylex.attrs(styles.list)">
      <li
        v-for="(item, index) in props.items"
        :key="`${index}-${item.label}`"
        v-bind="stylex.attrs(styles.item)"
      >
        <span
          v-if="index > 0"
          v-bind="stylex.attrs(styles.separator)"
          aria-hidden="true"
        >
          <ChevronRight :size="14" />
        </span>
        <RouterLink
          v-if="item.to"
          :to="item.to"
          v-bind="
            stylex.attrs(styles.link, focusRing.visible, reducedMotion.root)
          "
        >
          {{ item.label }}
        </RouterLink>
        <span v-else aria-current="page" v-bind="stylex.attrs(styles.current)">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
