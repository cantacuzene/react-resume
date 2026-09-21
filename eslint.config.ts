import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'
import functional from 'eslint-plugin-functional'
import importPlugin from 'eslint-plugin-import'
import jestDom from 'eslint-plugin-jest-dom'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import preferFunctionComponent from 'eslint-plugin-react-prefer-function-component'
import testingLibrary from 'eslint-plugin-testing-library'
import tseslint from 'typescript-eslint'

// docs/guidelines/common.md §4
const commonTestRestrictions = [
  {
    selector: 'CallExpression[callee.property.name=/Snapshot$/]',
    message: 'Snapshot tests are not allowed: assert on behaviour (docs/guidelines/common.md §4).',
  },
  {
    selector:
      "CallExpression[callee.object.name='vi'][callee.property.name=/^(mock|doMock)$/][arguments.0.value=/^(@\\/|\\.)/]",
    message: 'Do not mock own modules; mock only at the edges (docs/guidelines/common.md §4).',
  },
  {
    selector:
      "CallExpression[callee.object.name='vi'][callee.property.name=/^(mock|doMock)$/][arguments.0.source.value=/^(@\\/|\\.)/]",
    message: 'Do not mock own modules; mock only at the edges (docs/guidelines/common.md §4).',
  },
]

// docs/guidelines/frontend.md §4
const frontendTestRestrictions = [
  {
    selector:
      'CallExpression[callee.property.name=/ByTestId$/], CallExpression[callee.name=/ByTestId$/]',
    message: 'Query by role, label or text instead of test ids (docs/guidelines/frontend.md §4).',
  },
]

export default defineConfig(
  globalIgnores(['legacy/**', 'dist/**', 'coverage/**', 'src/*/gql/**', '.superpowers/**']),

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
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  {
    files: ['*.config.ts'],
    rules: { 'import/no-default-export': 'off' },
  },

  // docs/guidelines/frontend.md §1–§2: components and hooks
  {
    files: ['src/client/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    plugins: { 'react-prefer-function-component': preferFunctionComponent },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react-prefer-function-component/react-prefer-function-component': 'error',
    },
  },

  // docs/guidelines/frontend.md §2: fetch only in src/client/api/
  {
    files: ['src/client/**/*.{ts,tsx}'],
    ignores: ['src/client/api/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Call fetch only from src/client/api/ (docs/guidelines/frontend.md §2).',
        },
      ],
      'no-restricted-properties': [
        'error',
        ...['globalThis', 'window', 'self'].map((object) => ({
          object,
          property: 'fetch',
          message: 'Call fetch only from src/client/api/ (docs/guidelines/frontend.md §2).',
        })),
      ],
    },
  },

  // docs/guidelines/frontend.md §1 and §3: components are arrow constants, no hard-coded text
  {
    files: ['src/client/**/*.tsx'],
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: true }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
    },
  },

  // docs/guidelines/frontend.md §4 and common.md §4: tests
  { ...testingLibrary.configs['flat/react'], files: ['tests/**/*.{ts,tsx}'] },
  { ...jestDom.configs['flat/recommended'], files: ['tests/**/*.{ts,tsx}'] },
  {
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', ...commonTestRestrictions, ...frontendTestRestrictions],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/src/**'],
              message: 'Import sources through the `@/` alias (docs/guidelines/common.md §4).',
            },
          ],
        },
      ],
    },
  },
  // Vitest runs without globals (test.globals is unset), so Testing Library cannot detect a
  // global afterEach to register its own cleanup: this file's manual cleanup() is required.
  {
    files: ['tests/support/setup.ts'],
    rules: { 'testing-library/no-manual-cleanup': 'off' },
  },

  prettier,
)
