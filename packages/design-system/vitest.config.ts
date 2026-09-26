import { transformAsync } from '@babel/core'
import stylexBabelPlugin from '@stylexjs/babel-plugin'
import stylex from '@stylexjs/unplugin'
import vue from '@vitejs/plugin-vue'
import { createRequire } from 'node:module'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const require = createRequire(import.meta.url)

/**
 * Tests run the design-system sources as-is, so StyleX must be compiled in the
 * test pipeline too. @stylexjs/unplugin handles the `.ts` token files; this
 * companion transform compiles StyleX inside the `.vue` SFC scripts, mirroring
 * the app's `stylexVuePlugin` (minus CSS aggregation, which tests don't need).
 */
function stylexVueSfc(): Plugin {
  return {
    name: 'stylex:vue-sfc-test',
    enforce: 'post',

    async transform(code, id) {
      const filename = id.split('?')[0]
      if (!filename.endsWith('.vue')) return null
      if (!code.includes('@stylexjs/stylex')) return null

      const result = await transformAsync(code, {
        babelrc: false,
        filename,
        sourceMaps: true,
        plugins: [
          stylexBabelPlugin.withOptions({
            importSources: ['@stylexjs/stylex'],
            unstable_moduleResolution: {
              type: 'commonJS',
              rootDir: require('path').resolve(process.cwd()),
            },
            treeshakeCompensation: true,
          }),
        ],
        caller: {
          name: 'stylex:vue-sfc-test',
          supportsStaticESM: true,
          supportsDynamicImport: true,
          supportsTopLevelAwait: true,
          supportsExportNamespaceFrom: true,
        },
      })

      if (!result) return null

      return {
        code: result.code ?? code,
        map: result.map ?? null,
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), stylex.vite(), stylexVueSfc()],

  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    globals: true,
  },
})
