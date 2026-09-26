import { transformAsync } from '@babel/core'
import stylexBabelPlugin from '@stylexjs/babel-plugin'
import { createRequire } from 'node:module'
import type { Plugin } from 'vite'

const require = createRequire(import.meta.url)

interface StylexSharedStore {
  rulesById: Map<string, unknown>
  version: number
}

function getSharedStore(): StylexSharedStore {
  const g = globalThis as typeof globalThis & {
    __stylex_unplugin_store?: StylexSharedStore
  }
  if (!g.__stylex_unplugin_store) {
    g.__stylex_unplugin_store = {
      rulesById: new Map(),
      version: 0,
    }
  }
  return g.__stylex_unplugin_store
}

/**
 * @vitejs/plugin-vue serves `.vue` SFCs as a single JavaScript module in dev,
 * but @stylexjs/unplugin only transforms JS/TS/Svelte files. This companion
 * plugin runs after the Vue SFC compiler and compiles any StyleX calls inside
 * the compiled module, feeding the generated rules into the unplugin's shared
 * store so CSS extraction (dev + build) still works.
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

      const metadata = result.metadata as typeof result.metadata & {
        stylex?: Array<unknown>
      }
      const rules = metadata?.stylex
      const shared = getSharedStore()
      if (rules && rules.length > 0) {
        shared.rulesById.set(id, rules)
      } else {
        shared.rulesById.delete(id)
      }
      shared.version++

      return {
        code: result.code ?? code,
        map: result.map ?? null,
      }
    },
  }
}
