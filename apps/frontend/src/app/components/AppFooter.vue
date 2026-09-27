<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { Waypoints } from 'lucide-vue-next'
import {
  focusRing,
  reducedMotion,
  visuallyHidden,
} from '../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  layout,
  motion,
  spacing,
  typography,
} from '../../../../../packages/design-system/src/styles/tokens.stylex'
import { authorName, authorUrl, repositoryUrl } from '../site'

const styles = stylex.create({
  footer: {
    width: '100%',
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlock: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
    marginTop: spacing.xxl,
  },
  inner: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    margin: 0,
    fontSize: typography.sizeSm,
    color: colors.textSecondary,
    lineHeight: typography.leadingSnug,
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
    fontSize: typography.sizeSm,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xxs,
    color: colors.textSecondary,
    textDecoration: 'none',
    transition: `color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      color: colors.accent,
      textDecoration: 'underline',
    },
  },
  separator: {
    color: colors.border,
  },
})
</script>

<template>
  <footer v-bind="stylex.attrs(styles.footer)">
    <div v-bind="stylex.attrs(styles.inner)">
      <p v-bind="stylex.attrs(styles.text)">
        <Waypoints :size="14" aria-hidden="true" />
        Shelf — a modular-monolith demo built with Vue + StyleX.
      </p>

      <nav v-bind="stylex.attrs(styles.links)" aria-label="Project">
        <a
          :href="repositoryUrl"
          target="_blank"
          rel="noopener noreferrer"
          v-bind="
            stylex.attrs(styles.link, focusRing.visible, reducedMotion.root)
          "
        >
          GitHub
          <span v-bind="stylex.attrs(visuallyHidden.root)">
            (opens in a new tab)</span
          >
        </a>
        <span v-bind="stylex.attrs(styles.separator)" aria-hidden="true"
          >·</span
        >
        <a
          :href="authorUrl"
          target="_blank"
          rel="noopener noreferrer"
          v-bind="
            stylex.attrs(styles.link, focusRing.visible, reducedMotion.root)
          "
        >
          {{ authorName }}
          <span v-bind="stylex.attrs(visuallyHidden.root)">
            (opens in a new tab)</span
          >
        </a>
      </nav>
    </div>
  </footer>
</template>
