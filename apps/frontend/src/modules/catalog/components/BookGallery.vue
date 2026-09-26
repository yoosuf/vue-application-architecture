<script setup lang="ts">
import { computed, ref } from 'vue'
import * as stylex from '@stylexjs/stylex'
import BookCover from './BookCover.vue'
import { focusRing } from '../../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  motion,
  radii,
  shadows,
  spacing,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const props = defineProps<{
  srcs: string[]
  alt: string
}>()

const active = ref(0)
const thumbRefs = ref<(HTMLButtonElement | null)[]>([])

const count = computed(() => props.srcs.length)
const activeSrc = computed(
  () => props.srcs[active.value] ?? props.srcs[0] ?? '',
)

function select(index: number) {
  active.value = Math.min(Math.max(index, 0), count.value - 1)
}

function onThumbsKeydown(event: KeyboardEvent) {
  if (count.value < 2) return
  let next = active.value
  if (event.key === 'ArrowRight') next += 1
  else if (event.key === 'ArrowLeft') next -= 1
  else return
  event.preventDefault()
  const bounded = (next + count.value) % count.value
  active.value = bounded
  thumbRefs.value[bounded]?.focus()
}

const styles = stylex.create({
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  main: {
    borderRadius: radii.sm,
    boxShadow: shadows.card,
  },
  thumbs: {
    display: 'grid',
    gap: spacing.xs,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  thumb: {
    appearance: 'none',
    background: 'none',
    border: `2px solid transparent`,
    borderRadius: radii.sm,
    overflow: 'hidden',
    padding: 0,
    cursor: 'pointer',
    transition: `border-color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      borderColor: colors.borderStrong,
    },
  },
  thumbActive: {
    borderColor: colors.accent,
  },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.gallery)">
    <div v-bind="stylex.attrs(styles.main)">
      <BookCover
        :src="activeSrc"
        :alt="`${alt} — photo ${active + 1} of ${count}`"
        priority
        zoom-on-hover
      />
    </div>

    <div
      v-if="count > 1"
      role="group"
      :aria-label="`Photos of ${alt}`"
      v-bind="stylex.attrs(styles.thumbs)"
      :style="{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }"
      @keydown="onThumbsKeydown"
    >
      <button
        v-for="(src, index) in srcs"
        :key="src"
        :ref="
          (element) => (thumbRefs[index] = element as HTMLButtonElement | null)
        "
        type="button"
        :aria-label="`Photo ${index + 1} of ${count}`"
        :aria-pressed="index === active ? 'true' : 'false'"
        :tabindex="index === active ? 0 : -1"
        v-bind="
          stylex.attrs(
            styles.thumb,
            index === active ? styles.thumbActive : false,
            focusRing.visible,
          )
        "
        @click="select(index)"
      >
        <BookCover :src="src" :alt="`${alt}, photo ${index + 1}`" />
      </button>
    </div>
  </div>
</template>
