import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'
import functional from 'eslint-plugin-functional'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

// docs/guidelines/common.md §4
const commonTestRestrictions = [
  {
    selector: 'CallExpression[callee.property.name=/^toMatch(Inline)?Snapshot$/]',
    message: 'Snapshot tests are not allowed: assert on behaviour (docs/guidelines/common.md §4).',
  },
  {
    selector:
      "CallExpression[callee.object.name='vi'][callee.property.name=/^(mock|doMock)$/][arguments.0.value=/^@\\W/]",
    message: 'Do not mock own modules; mock only at the edges (docs/guidelines/common.md §4).',
  },
]

export default defineConfig(
  globalIgnores(['legacy/**', 'dist/**', 'coverage/**', 'src/gql/**']),

  // docs/guidelines/common.md §1–§2
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { functional, import: importPlugin },
    rules: {
      'functional/no-let': 'error',
      'functional/immutable-data': 'error',
      'functional/no-loop-statements': 'error',
      'functional/no-classes': 'error',
      'functional/no-this-expressions': 'error',
      'functional/prefer-immutable-types': [
        'error',
        { enforcement: 'ReadonlyShallow', ignoreInferredTypes: true },
      ],
      'import/no-default-export': 'error',
    },
  },
  {
    files: ['*.config.ts'],
    rules: { 'import/no-default-export': 'off' },
  },
  {
    files: ['tests/**/*.{ts,tsx}'],
    rules: { 'no-restricted-syntax': ['error', ...commonTestRestrictions] },
  },

  prettier,
)
