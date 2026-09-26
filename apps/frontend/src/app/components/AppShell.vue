<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import type { darkTheme } from '../../../../../packages/design-system/src/styles/themes.stylex'
import {
  colors,
  typography,
} from '../../../../../packages/design-system/src/styles/tokens.stylex'

const props = defineProps<{
  themeClass: typeof darkTheme
  colorScheme: 'light' | 'dark'
}>()

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontFamily: typography.fontSans,
    fontSize: typography.sizeBase,
    lineHeight: typography.leadingNormal,
  },
})
</script>

<template>
  <div
    v-bind="stylex.attrs(styles.root, themeClass)"
    :style="{ colorScheme: props.colorScheme }"
  >
    <slot />
  </div>
</template>
