import { dirname, relative, resolve } from 'node:path'
import type { Rule } from 'eslint'
import type {
  ExportAllDeclaration,
  ExportNamedDeclaration,
  ImportDeclaration,
} from 'estree'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'

type ImportExportNode =
  ImportDeclaration | ExportNamedDeclaration | ExportAllDeclaration

export default defineConfigWithVueTs(
  {
    name: 'design-system/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'design-system/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/eslint.config.ts'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'design-system/custom-rules',
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'ds/self-contained': 'error',
    },
    plugins: {
      ds: {
        rules: {
          'self-contained': {
            meta: { type: 'problem' },
            create(context: Rule.RuleContext) {
              const pkgRoot = resolve(process.cwd())
              const check = (node: ImportExportNode) => {
                if (!node.source || typeof node.source.value !== 'string')
                  return
                const source = node.source.value
                const target = resolve(dirname(context.filename), source)
                const insidePackage = !relative(pkgRoot, target).startsWith(
                  '..',
                )
                if (!insidePackage) {
                  context.report({
                    node,
                    message:
                      'design-system must only depend on node_modules packages; relative ' +
                      'imports may not escape the package source.',
                  })
                }
              }
              return {
                ImportDeclaration: check,
                ExportNamedDeclaration: check,
                ExportAllDeclaration: check,
              }
            },
          },
        },
      },
    },
  },
)
