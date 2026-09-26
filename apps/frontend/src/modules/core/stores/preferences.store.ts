import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Theme } from '@vue-application-architecture/design-system/theme'

export const THEME_STORAGE_KEY = 'shelf:theme'

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function readStoredTheme(): Theme | null {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') return raw
    return null
  } catch {
    return null
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<Theme>(readStoredTheme() ?? systemTheme())

  function persist() {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme.value)
    } catch {
      // Storage may be unavailable (private mode, quota). Best effort only.
    }
  }

  function setTheme(value: Theme) {
    theme.value = value
    persist()
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
})
