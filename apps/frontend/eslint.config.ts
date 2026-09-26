import { dirname, join, relative, resolve } from 'node:path'
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

const FEATURE_MODULES = new Set(['catalog', 'favorites', 'cart', 'checkout'])
const ALL_MODULES = new Set(['core', ...FEATURE_MODULES])

type ImportExportNode =
  ImportDeclaration | ExportNamedDeclaration | ExportAllDeclaration

/**
 * Modular-monolith boundaries.
 *
 * - core -> design-system / @vue-application-architecture/types only (components and preferences),
 *   never app/features; features may only reach core through its facade
 * - feature -> design-system (any file) and other feature/module facades, never
 *   internals
 * - feature -> app is forbidden (the app is the composition root)
 * - src/app -> anything (composition root)
 *
 * The @vue-application-architecture/design-system workspace package is a sibling in the monorepo; it
 * may be imported from anywhere in the app by package specifier (components,
 * domain types, styles) and, for StyleX-compiled token references, by relative
 * path into packages/design-system/src.
 */
function boundaries(
  context: Rule.RuleContext,
  node: ImportExportNode,
  source: string,
) {
  const srcDir = join(process.cwd(), 'src')
  const filename = context.filename
  const relToSrc = relative(srcDir, filename)

  const fileModule = relToSrc.startsWith('modules')
    ? relToSrc.split('/')[1]
    : relToSrc.split('/')[0]

  if (!ALL_MODULES.has(fileModule)) return

  let targetPath
  if (source.startsWith('@/')) {
    targetPath = join(srcDir, source.slice(2))
  } else if (source.startsWith('.')) {
    targetPath = resolve(dirname(filename), source)
  } else {
    return
  }

  if (source.startsWith('@vue-application-architecture/design-system')) return

  const rel = relative(srcDir, targetPath).split('/')
  let targetModule = null
  let targetIsFacade = false

  if (rel[0] === 'modules') {
    targetModule = rel[1]
    const inside = relative(join(srcDir, 'modules', targetModule), targetPath)
    targetIsFacade = inside === '' || inside === 'index.ts'
  } else if (rel[0] === 'app') {
    targetModule = 'app'
  }

  if (targetPath.includes(join('packages', 'design-system', 'src'))) {
    targetModule = 'design-system'
  }

  if (targetModule === null) return

  const forbidden = (message: string) =>
    context.report({
      node,
      message: `Modular-monolith boundary: ${fileModule} -> ${targetModule} is forbidden. ${message}`,
    })

  if (fileModule === 'core') {
    if (targetModule !== 'core' && targetModule !== 'design-system') {
      return forbidden(
        'The core module cannot depend on app or feature modules.',
      )
    }
    return
  }

  if (targetModule === 'design-system') return

  if (targetModule === 'app') {
    return forbidden(
      'Feature modules must not import from the app composition root.',
    )
  }

  if (targetModule === 'core' && !targetIsFacade) {
    return forbidden(
      'Import the core module (book components, NotFoundView, preferences) only through its index.ts facade.',
    )
  }

  if (
    FEATURE_MODULES.has(targetModule) &&
    targetModule !== fileModule &&
    !targetIsFacade
  ) {
    return forbidden(
      `Import from the '${targetModule}' module only through its public index.ts facade.`,
    )
  }
}

const modularMonolithPlugin: {
  name: string
  rules: { boundaries: Rule.RuleModule }
} = {
  name: 'shelf/modular-monolith',
  rules: {
    boundaries: {
      meta: { type: 'problem' },
      create(context: Rule.RuleContext) {
        const check = (node: ImportExportNode) => {
          if (!node.source || typeof node.source.value !== 'string') return
          boundaries(context, node, node.source.value)
        }
        return {
          ImportDeclaration: check,
          ExportNamedDeclaration: check,
          ExportAllDeclaration: check,
        }
      },
    },
  },
}

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-demo/**', '**/coverage/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'app/custom-rules',
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  {
    name: 'app/modular-monolith-boundaries',
    plugins: { modular: modularMonolithPlugin },
    rules: {
      'modular/boundaries': 'error',
    },
  },
)
