import { createPinia, setActivePinia } from 'pinia'
import { THEME_STORAGE_KEY, usePreferencesStore } from '@/modules/core'

describe('preferences store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('defaults to light when the system prefers light', () => {
    const preferences = usePreferencesStore()
    expect(preferences.theme).toBe('light')
  })

  it('sets a theme explicitly', () => {
    const preferences = usePreferencesStore()
    preferences.setTheme('dark')
    expect(preferences.theme).toBe('dark')
  })

  it('toggles between themes', () => {
    const preferences = usePreferencesStore()
    preferences.toggleTheme()
    expect(preferences.theme).toBe('dark')
    preferences.toggleTheme()
    expect(preferences.theme).toBe('light')
  })

  it('persists the chosen theme', () => {
    const preferences = usePreferencesStore()
    preferences.setTheme('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('restores a persisted theme', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')

    const preferences = usePreferencesStore()
    expect(preferences.theme).toBe('dark')
  })

  it('falls back to the system theme for invalid stored values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'blorp')

    const preferences = usePreferencesStore()
    expect(preferences.theme).toBe('light')
  })
})
