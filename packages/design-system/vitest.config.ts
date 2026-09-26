import stylex from '@stylexjs/unplugin'
import vue from '@vitejs/plugin-vue'
import { stylexVue } from './config/stylexVuePlugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), stylex.vite(), stylexVue()],

  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    globals: true,
  },
})