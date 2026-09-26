<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import EmptyState from '@vue-application-architecture/design-system/ui/molecules/EmptyState.vue'
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import {
  layout,
  spacing,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const styles = stylex.create({
  section: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlock: spacing.xxxl,
  },
})
</script>

<template>
  <section v-bind="stylex.attrs(styles.section)">
    <EmptyState
      heading-level="h1"
      title="Page not found"
      message="The page you are looking for does not exist or has moved."
    >
      <AppButton :to="{ name: 'explore' }">Back to Explore</AppButton>
    </EmptyState>
  </section>
</template>
