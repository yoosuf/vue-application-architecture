<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { Heart } from 'lucide-vue-next'
import { computed } from 'vue'
import IconButton from '@vue-application-architecture/design-system/ui/atoms/IconButton.vue'
import { reducedMotion } from '../../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  motion,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import { useFavoritesStore } from '../stores/favorites.store'
import type { Book } from '@vue-application-architecture/types/book'

const props = defineProps<{
  book: Book
}>()

const favorites = useFavoritesStore()

const active = computed(() => favorites.isFavorite(props.book.id))

const label = computed(() =>
  active.value
    ? `Remove ${props.book.title} from favorites`
    : `Add ${props.book.title} to favorites`,
)

const heartPop = stylex.keyframes({
  '0%': { transform: 'scale(0.7)' },
  '55%': { transform: 'scale(1.25)' },
  '100%': { transform: 'scale(1)' },
})

const styles = stylex.create({
  icon: {
    display: 'flex',
    color: colors.textSecondary,
  },
  iconActive: {
    color: colors.favorite,
    animationName: heartPop,
    animationDuration: motion.base,
    animationTimingFunction: motion.easeOut,
    animationIterationCount: 1,
  },
})
</script>

<template>
  <IconButton
    :label="label"
    :pressed="active"
    @click="favorites.toggleFavorite(book.id)"
  >
    <span
      :key="active ? 'active' : 'idle'"
      v-bind="
        stylex.attrs(
          active ? styles.iconActive : styles.icon,
          reducedMotion.root,
        )
      "
    >
      <Heart
        :size="18"
        :fill="active ? 'currentColor' : 'none'"
        aria-hidden="true"
      />
    </span>
  </IconButton>
</template>
