<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as stylex from '@stylexjs/stylex'
import { ChevronRight, Github, Menu } from 'lucide-vue-next'
import AppLogo from './AppLogo.vue'
import Drawer from '@vue-application-architecture/design-system/ui/molecules/Drawer.vue'
import IconButton from '@vue-application-architecture/design-system/ui/atoms/IconButton.vue'
import ThemeToggle from '@vue-application-architecture/design-system/ui/atoms/ThemeToggle.vue'
import SearchBar from '@vue-application-architecture/design-system/ui/molecules/SearchBar.vue'
import {
  focusRing,
  reducedMotion,
  visuallyHidden,
} from '../../../../../packages/design-system/src/styles/shared.stylex'
import {
  colors,
  layout,
  motion,
  radii,
  spacing,
  typography,
} from '../../../../../packages/design-system/src/styles/tokens.stylex'
import { useCatalogStore } from '../../modules/catalog'
import { usePreferencesStore } from '../../modules/core'
import { CartLink } from '../../modules/cart'
import { useCustomerStore } from '../../modules/customer'

const catalog = useCatalogStore()
const preferences = usePreferencesStore()
const customer = useCustomerStore()
const route = useRoute()

const menuOpen = ref(false)

const repositoryUrl = 'https://github.com/yoosuf/vue-application-architecture'

const menuItems = computed(() =>
  customer.isSignedIn
    ? [
        {
          label: 'Explore',
          to: { name: 'explore' },
          active: route.name === 'explore',
        },
        {
          label: 'Account',
          to: { name: 'account-orders' },
          active:
            typeof route.name === 'string' && route.name.startsWith('account'),
        },
      ]
    : [
        {
          label: 'Explore',
          to: { name: 'explore' },
          active: route.name === 'explore',
        },
        {
          label: 'Log in',
          to: { name: 'login' },
          active: route.name === 'login',
        },
      ],
)

const styles = stylex.create({
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: colors.background,
    borderBottom: `1px solid ${colors.border}`,
  },
  topRow: {
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
    flexGrow: 0,
    textDecoration: 'none',
    transition: `opacity ${motion.fast} ${motion.easeOut}`,
    ':hover': {
      opacity: 0.75,
    },
  },
  search: {
    flex: 1,
    minWidth: 0,
    maxWidth: 640,
    marginInlineStart: 'auto',
    '@media (max-width: 900px)': {
      maxWidth: 320,
    },
    '@media (max-width: 760px)': {
      display: 'none',
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    flexGrow: 0,
    marginInlineStart: 'auto',
  },
  divider: {
    width: 1,
    height: 20,
    marginInline: spacing.xs,
    backgroundColor: colors.border,
    '@media (max-width: 760px)': {
      display: 'none',
    },
  },
  menuBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  menuSearch: {
    '@media (min-width: 761px)': {
      display: 'none',
    },
  },
  menuGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xxs,
  },
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: radii.md,
    color: colors.textPrimary,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    textDecoration: 'none',
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      color: colors.accent,
      backgroundColor: colors.accentSoft,
    },
  },
  menuLinkActive: {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    ':hover': {
      color: colors.accent,
      backgroundColor: colors.accentSoft,
    },
  },
  githubLink: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: radii.md,
    color: colors.textSecondary,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    textDecoration: 'none',
    transition: `color ${motion.base} ${motion.easeOut}, background-color ${motion.base} ${motion.easeOut}`,
    ':hover': {
      color: colors.accent,
      backgroundColor: colors.accentSoft,
    },
  },
  menuLinkChevron: {
    display: 'flex',
    color: colors.textSecondary,
  },
  themeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    '@media (min-width: 761px)': {
      display: 'none',
    },
  },
  themeLabel: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
})
</script>

<template>
  <header v-bind="stylex.attrs(styles.wrapper)">
    <div v-bind="stylex.attrs(styles.topRow)">
      <RouterLink
        to="/"
        v-bind="stylex.attrs(styles.logoLink)"
        aria-label="Shelf home"
      >
        <AppLogo />
      </RouterLink>

      <div v-bind="stylex.attrs(styles.search)">
        <SearchBar
          :model-value="catalog.searchQuery"
          placeholder="Search books"
          @update:model-value="catalog.setSearchQuery"
        />
      </div>

      <div v-bind="stylex.attrs(styles.actions)">
        <ThemeToggle
          :theme="preferences.theme"
          @toggle="preferences.toggleTheme"
        />
        <span v-bind="stylex.attrs(styles.divider)" aria-hidden="true" />
        <CartLink />
        <IconButton
          label="Open menu"
          :aria-expanded="menuOpen"
          aria-haspopup="dialog"
          @click="menuOpen = !menuOpen"
        >
          <Menu :size="20" aria-hidden="true" />
        </IconButton>
      </div>
    </div>

    <Drawer :open="menuOpen" title="Menu" @close="menuOpen = false">
      <div v-bind="stylex.attrs(styles.menuBody)">
        <div v-bind="stylex.attrs(styles.menuSearch)">
          <SearchBar
            :model-value="catalog.searchQuery"
            placeholder="Search books"
            @update:model-value="catalog.setSearchQuery"
          />
        </div>

        <div v-bind="stylex.attrs(styles.menuGroup)">
          <RouterLink
            v-for="item in menuItems"
            :key="item.label"
            :to="item.to"
            v-bind="
              stylex.attrs(
                styles.menuLink,
                item.active && styles.menuLinkActive,
                focusRing.visible,
                reducedMotion.root,
              )
            "
            @click="menuOpen = false"
          >
            {{ item.label }}
            <span
              v-bind="stylex.attrs(styles.menuLinkChevron)"
              aria-hidden="true"
            >
              <ChevronRight :size="18" />
            </span>
          </RouterLink>
        </div>

        <div v-bind="stylex.attrs(styles.menuGroup)">
          <a
            :href="repositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            v-bind="
              stylex.attrs(
                styles.githubLink,
                focusRing.visible,
                reducedMotion.root,
              )
            "
          >
            <Github :size="18" aria-hidden="true" />
            Source on GitHub
            <span v-bind="stylex.attrs(visuallyHidden.root)">
              (opens in a new tab)</span
            >
          </a>
        </div>
      </div>

      <template #footer>
        <div v-bind="stylex.attrs(styles.themeRow)">
          <span v-bind="stylex.attrs(styles.themeLabel)">Theme</span>
          <ThemeToggle
            :theme="preferences.theme"
            @toggle="preferences.toggleTheme"
          />
        </div>
      </template>
    </Drawer>
  </header>
</template>
