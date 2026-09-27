import vue from '@vitejs/plugin-vue'
import { stylexVite } from './config/stylexVitePlugin.ts'
import { stylexVue } from './config/stylexVuePlugin.ts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), stylexVite(), stylexVue()],

  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    globals: true,
  },
})
