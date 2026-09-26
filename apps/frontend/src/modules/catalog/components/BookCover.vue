<script setup lang="ts">
import { ref } from 'vue'
import * as stylex from '@stylexjs/stylex'
import { reducedMotion } from '../../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  motion,
  radii,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    priority?: boolean
    zoomOnHover?: boolean
  }>(),
  {
    priority: false,
    zoomOnHover: false,
  },
)

const loaded = ref(false)

const shimmer = stylex.keyframes({
  '0%': { opacity: 0.55 },
  '100%': { opacity: 1 },
})

const styles = stylex.create({
  root: {
    position: 'relative',
    width: '100%',
    aspectRatio: '2 / 3',
    backgroundColor: colors.surfaceHover,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  rootLoading: {
    animationName: shimmer,
    animationDuration: '1s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: `opacity ${motion.base} ${motion.easeOut}, transform ${motion.slow} ${motion.easeOut}`,
  },
  imageIdle: {
    opacity: 0,
  },
  imageLoaded: {
    opacity: 1,
  },
  imageZoom: {
    ':hover': {
      transform: 'scale(1.045)',
    },
  },
})
</script>

<template>
  <div
    v-bind="
      stylex.attrs(
        styles.root,
        !loaded && styles.rootLoading,
        reducedMotion.root,
      )
    "
  >
    <img
      v-bind="
        stylex.attrs(
          styles.image,
          loaded ? styles.imageLoaded : styles.imageIdle,
          props.zoomOnHover && styles.imageZoom,
        )
      "
      :src="props.src"
      :alt="props.alt"
      :loading="props.priority ? 'eager' : 'lazy'"
      :decoding="props.priority ? 'sync' : 'async'"
      @load="loaded = true"
    />
  </div>
</template>
