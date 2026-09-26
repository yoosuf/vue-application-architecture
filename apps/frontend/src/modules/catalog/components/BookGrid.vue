<script setup lang="ts">
import ResponsiveGrid from '@vue-application-architecture/design-system/ui/molecules/ResponsiveGrid.vue'
import BookCard from './BookCard.vue'
import type { Book } from '@vue-application-architecture/types/book'

defineProps<{
  books: Book[]
  minColumns?: 1 | 2
}>()
</script>

<template>
  <ResponsiveGrid v-if="books.length > 0" :min-columns="minColumns">
    <BookCard v-for="book in books" :key="book.id" :book="book">
      <template #footer><slot name="footer" :book="book" /></template>
    </BookCard>
  </ResponsiveGrid>
</template>
