<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import {
  colors,
  radii,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    priority?: boolean
  }>(),
  {
    priority: false,
  },
)

const styles = stylex.create({
  root: {
    position: 'relative',
    width: '100%',
    aspectRatio: '2 / 3',
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">
    <img
      v-bind="stylex.attrs(styles.image)"
      :src="props.src"
      :alt="props.alt"
      :loading="props.priority ? 'eager' : 'lazy'"
      :decoding="props.priority ? 'sync' : 'async'"
    />
  </div>
</template>
