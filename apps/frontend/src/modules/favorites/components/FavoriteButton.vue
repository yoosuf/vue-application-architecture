<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { Heart } from 'lucide-vue-next'
import { computed } from 'vue'
import IconButton from '@vue-application-architecture/design-system/ui/atoms/IconButton.vue'
import { useFavoritesStore } from '../stores/favorites.store'
import { colors } from '../../../../../../packages/design-system/src/styles/tokens.stylex'
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

const styles = stylex.create({
  icon: {
    display: 'flex',
    color: colors.textSecondary,
  },
  iconActive: {
    color: colors.favorite,
  },
})
</script>

<template>
  <IconButton
    :label="label"
    :pressed="active"
    @click="favorites.toggleFavorite(book.id)"
  >
    <span v-bind="stylex.attrs(styles.icon, active && styles.iconActive)">
      <Heart
        :size="18"
        :fill="active ? 'currentColor' : 'none'"
        aria-hidden="true"
      />
    </span>
  </IconButton>
</template>
