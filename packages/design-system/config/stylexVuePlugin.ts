import { transformAsync } from '@babel/core'
import stylexBabelPlugin from '@stylexjs/babel-plugin'
import { createRequire } from 'node:module'
import type { Plugin } from 'vite'

const require = createRequire(import.meta.url)

/**
 * @vitejs/plugin-vue serves `.vue` SFCs as a single JavaScript module, but
 * @stylexjs/unplugin only transforms JS/TS files. This companion plugin runs
 * after the Vue SFC compiler and compiles any StyleX calls inside the compiled
 * module, so StyleX also works inside `.vue` files in the package's demo dev
 * server and in the test pipeline (no CSS aggregation is needed there).
 */
export function stylexVue(): Plugin {
  return {
    name: 'stylex:vue-sfc',
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
          name: 'stylex:vue-sfc',
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