<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BookDetails from '../components/BookDetails.vue'
import { BookGrid } from '..'
import { NotFoundView } from '../../core'
import { useCatalogStore } from '../stores/catalog.store'
import {
  colors,
  layout,
  spacing,
  typography,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const route = useRoute()
const catalog = useCatalogStore()

const bookId = computed(() => String(route.params.id))
const book = computed(() => catalog.findBookById(bookId.value))
const relatedBooks = computed(() => catalog.relatedBooks(bookId.value, 4))

const styles = stylex.create({
  related: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlock: spacing.xxl,
  },
  heading: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.size2xl,
    fontWeight: typography.weightBold,
    lineHeight: typography.leadingTight,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
})
</script>

<template>
  <BookDetails v-if="book" :book="book" />
  <NotFoundView v-else />

  <section
    v-if="relatedBooks.length > 0"
    aria-labelledby="related-books-title"
    v-bind="stylex.attrs(styles.related)"
  >
    <h2 id="related-books-title" v-bind="stylex.attrs(styles.heading)">
      Related books
    </h2>
    <BookGrid :books="relatedBooks" />
  </section>
</template>
