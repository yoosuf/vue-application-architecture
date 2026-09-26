<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppShell from './components/AppShell.vue'
import SkipLink from './components/SkipLink.vue'
import AppHeader from './components/AppHeader.vue'
import MainContent from './components/MainContent.vue'
import AppFooter from './components/AppFooter.vue'
import StatusAnnouncer from './components/StatusAnnouncer.vue'
import {
  darkTheme,
  lightTheme,
} from '../../../../packages/design-system/src/styles/themes.stylex'
import { usePreferencesStore } from '../modules/core'

const preferences = usePreferencesStore()
const route = useRoute()
const router = useRouter()

const themeClass = computed(() =>
  preferences.theme === 'dark' ? darkTheme : lightTheme,
)

const colorScheme = computed(() => preferences.theme)

const isNavigating = ref(false)
const removeBeforeEach = router.beforeEach(() => {
  isNavigating.value = true
})
const removeAfterEach = router.afterEach(() => {
  isNavigating.value = false
})
onUnmounted(() => {
  removeBeforeEach()
  removeAfterEach()
})

const statusMessage = ref('')

watch(
  () => route.fullPath,
  async () => {
    statusMessage.value = ''
    await nextTick()
    statusMessage.value = `${String(route.meta.title ?? 'Shelf')} loaded`
    document.getElementById('main-content')?.focus({ preventScroll: true })
  },
)
</script>

<template>
  <AppShell :theme-class="themeClass" :color-scheme="colorScheme">
    <SkipLink />
    <AppHeader />
    <MainContent :loading="isNavigating" />
    <AppFooter />
    <StatusAnnouncer :message="statusMessage" />
  </AppShell>
</template>
