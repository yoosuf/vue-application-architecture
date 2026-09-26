<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import BookCard from './BookCard.vue'
import { spacing } from '../../../../../../packages/design-system/src/styles/tokens.stylex'
import type { Book } from '@vue-application-architecture/types/book'

defineProps<{
  books: Book[]
}>()

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(5, minmax(0, 1fr))',
      '@media (max-width: 1200px)': 'repeat(4, minmax(0, 1fr))',
      '@media (max-width: 900px)': 'repeat(3, minmax(0, 1fr))',
      '@media (max-width: 600px)': 'repeat(2, minmax(0, 1fr))',
    },
    gap: {
      default: spacing.lg,
      '@media (max-width: 600px)': spacing.md,
    },
  },
})
</script>

<template>
  <div v-if="books.length > 0" v-bind="stylex.attrs(styles.grid)">
    <BookCard v-for="book in books" :key="book.id" :book="book">
      <template #footer><slot name="footer" :book="book" /></template>
    </BookCard>
  </div>
</template>
