<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import Loader from '../atoms/Loader.vue'
import { colors, layout, radii } from '../../styles/tokens.stylex'

defineProps<{
  loading?: boolean
}>()

const styles = stylex.create({
  main: {
    flex: 1,
    scrollMarginTop: layout.headerHeight,
    ':focus-visible': {
      outline: 'none',
      boxShadow: `inset 0 0 0 3px ${colors.accent}`,
      borderRadius: radii.sm,
    },
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
  },
})
</script>

<template>
  <main id="main-content" tabindex="-1" v-bind="stylex.attrs(styles.main)">
    <div v-if="loading" v-bind="stylex.attrs(styles.loading)">
      <Loader :size="32" label="Loading page" />
    </div>
    <RouterView v-else />
  </main>
</template>
