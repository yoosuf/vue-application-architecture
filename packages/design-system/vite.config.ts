import stylex from '@stylexjs/unplugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { stylexVue } from './config/stylexVuePlugin.ts'

export default defineConfig({
  root: 'demo',
  base: './',
  plugins: [vue(), stylex.vite(), stylexVue()],
  build: {
    outDir: '../dist-demo',
  },
})