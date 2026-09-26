<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import AppLogo from './AppLogo.vue'
import NavigationLink from './NavigationLink.vue'
import ThemeToggle from '@vue-application-architecture/design-system/ui/atoms/ThemeToggle.vue'
import SearchBar from '@vue-application-architecture/design-system/ui/molecules/SearchBar.vue'
import { useCatalogStore } from '../../modules/catalog'
import { usePreferencesStore } from '../../modules/core'
import { CartLink } from '../../modules/cart'
import {
  colors,
  layout,
  motion,
  spacing,
} from '../../../../../packages/design-system/src/styles/tokens.stylex'

const catalog = useCatalogStore()
const preferences = usePreferencesStore()

const styles = stylex.create({
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: colors.background,
    borderBottom: `1px solid ${colors.border}`,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    maxWidth: layout.pageMaxWidth,
    margin: '0 auto',
    paddingInline: layout.pageGutter,
    paddingBlock: spacing.sm,
  },
  logoLink: {
    display: 'inline-flex',
    textDecoration: 'none',
    marginRight: spacing.xs,
    transition: `opacity ${motion.fast} ${motion.easeOut}`,
    ':hover': {
      opacity: 0.75,
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 0,
  },
  search: {
    flex: 1,
    maxWidth: '320px',
    marginInlineStart: 'auto',
    '@media (max-width: 760px)': {
      display: 'none',
    },
  },
})
</script>

<template>
  <header v-bind="stylex.attrs(styles.wrapper)">
    <div v-bind="stylex.attrs(styles.header)">
      <RouterLink
        to="/"
        v-bind="stylex.attrs(styles.brand, styles.logoLink)"
        aria-label="Shelf home"
      >
        <AppLogo />
      </RouterLink>

      <nav v-bind="stylex.attrs(styles.nav)" aria-label="Primary">
        <NavigationLink :to="{ name: 'explore' }" label="Explore" />
        <NavigationLink :to="{ name: 'favorites' }" label="Favorites" />
        <CartLink />
      </nav>

      <div v-bind="stylex.attrs(styles.search)">
        <SearchBar
          :model-value="catalog.searchQuery"
          placeholder="Search books"
          @update:model-value="catalog.setSearchQuery"
        />
      </div>

      <ThemeToggle
        :theme="preferences.theme"
        @toggle="preferences.toggleTheme"
      />
    </div>
  </header>
</template>
