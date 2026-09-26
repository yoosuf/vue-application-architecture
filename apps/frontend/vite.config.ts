import vue from '@vitejs/plugin-vue'
import stylex from '@stylexjs/unplugin'
import { fileURLToPath, URL } from 'node:url'
import { stylexVue } from './config/stylexVuePlugin.ts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), stylex.vite(), stylexVue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@vue-application-architecture/types': fileURLToPath(
        new URL('../../packages/types/src', import.meta.url),
      ),
      '@vue-application-architecture/design-system': fileURLToPath(
        new URL('../../packages/design-system/src', import.meta.url),
      ),
    },
  },

  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
