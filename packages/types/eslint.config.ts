import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  {
    name: 'types/files-to-lint',
    files: ['**/*.ts'],
  },

  {
    name: 'types/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/eslint.config.ts'],
  },

  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'types/custom-rules',
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
)
