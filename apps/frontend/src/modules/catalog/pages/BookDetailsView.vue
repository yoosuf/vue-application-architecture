<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as stylex from '@stylexjs/stylex'
import BookDetails from '../components/BookDetails.vue'
import { BookGrid } from '..'
import { NotFoundView } from '../../core'
import { useCatalogStore } from '../stores/catalog.store'
import { AddToCartButton } from '../../cart'
import { FavoriteButton } from '../../favorites'
import Breadcrumbs from '@vue-application-architecture/design-system/ui/molecules/Breadcrumbs.vue'
import PageSection from '@vue-application-architecture/design-system/ui/molecules/PageSection.vue'
import SectionHeading from '@vue-application-architecture/design-system/ui/atoms/SectionHeading.vue'
import {
  layout,
  spacing,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const route = useRoute()
const catalog = useCatalogStore()

const bookId = computed(() => String(route.params.id))
const book = computed(() => catalog.findBookById(bookId.value))
const relatedBooks = computed(() => catalog.relatedBooks(bookId.value, 4))

const breadcrumbs = computed(() => {
  if (!book.value) return []
  return [
    { label: 'Home', to: '/' },
    {
      label: book.value.category,
      to: {
        name: 'collection',
        params: { category: book.value.category.toLowerCase() },
      },
    },
    { label: book.value.title },
  ]
})

const styles = stylex.create({
  breadcrumbs: {
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlockStart: spacing.sm,
  },
})
</script>

<template>
  <template v-if="book">
    <div v-bind="stylex.attrs(styles.breadcrumbs)">
      <Breadcrumbs :items="breadcrumbs" label="Product breadcrumbs" />
    </div>
    <BookDetails :book="book" />
  </template>
  <NotFoundView v-else />

  <PageSection v-if="relatedBooks.length > 0" labelledby="related-books-title">
    <SectionHeading id="related-books-title" size="2xl" margin-block-end="lg">
      You may also like
    </SectionHeading>
    <BookGrid :books="relatedBooks" :min-columns="2">
      <template #footer="{ book }">
        <AddToCartButton :book="book" size="sm" block />
        <FavoriteButton :book="book" />
      </template>
    </BookGrid>
  </PageSection>
</template>
