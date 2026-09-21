# Guidelines Enforcement Tooling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy webpack/Babel setup with a single-package Bun + Vite + React + TypeScript
toolchain where every rule of `docs/guidelines/common.md` and `docs/guidelines/frontend.md` is
enforced by a tool, proven by a test, and run on pre-commit and in CI.

**Architecture:** The old app moves as-is into `legacy/` (not built, linted or tested). The repo
root becomes one Bun package with a minimal Vite + React scaffold in `src/`, tests in `tests/`
mirroring `src/`, one ESLint flat config whose rules are each exercised by `tests/lint/*` via
ESLint's `lintText` API, a `check-tests` script, and a `verify` script run by Lefthook and GitHub
Actions.

**Tech Stack:** Bun, TypeScript `~6.0`, Vite 8, React 19, Vitest 5 (jsdom, v8 coverage), React
Testing Library, MSW 2, ESLint `^9` (flat config, `typescript-eslint`, `eslint-plugin-functional`,
`eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-react-hooks`,
`eslint-plugin-react-prefer-function-component`, `eslint-plugin-testing-library`,
`eslint-plugin-jest-dom`, `eslint-config-prettier`), Prettier, Lefthook.

**Spec:** `docs/superpowers/specs/2026-09-21-react-guidelines-design.md`, applying
`docs/guidelines/common.md` and `docs/guidelines/frontend.md`.

## Global Constraints

- One package at the repo root; no workspaces. New code in `src/`, tests in `tests/` mirroring
  `src/` exactly (`src/a/B.tsx` → `tests/a/B.test.tsx`).
- `legacy/` is never built, installed, linted, formatted or tested.
- ESLint pinned to `^9` (`eslint-plugin-react` and `eslint-plugin-import` do not support 10).
  TypeScript pinned to `~6.0` (`typescript-eslint` requires `< 6.1`).
- No semicolons, single quotes, trailing commas, 100-column lines, 2-space indent.
- Named exports only (except `*.config.ts`). Components are arrow constants. No classes, no `let`,
  no loops, no mutation, readonly parameters.
- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Coverage ≥ 90% lines and branches over `src/**`, excluding `src/main.tsx` and `src/gql/**`.
- `codegen` / `check:gql` are **not** part of this plan (added in sub-project 3).
- Every commit message ends with:
  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  ```
- One GitHub issue (label `enhancement`) lists every task as a checkbox. One branch and PR per
  task, **stacked**: task N's branch `tooling/N-<slug>` is created from task N−1's branch (task 1
  from `docs/react-guidelines`), and its PR targets that branch with `Part of #<issue>` in the
  body (task 7: `Closes #<issue>`). Tick the task's box when its PR is opened. PRs are merged
  bottom-up. Slugs: `1-legacy-bun`, `2-vite-scaffold`, `3-prettier`, `4-eslint-common`,
  `5-eslint-frontend`, `6-check-tests`, `7-verify-ci`.

## File Map

| File | Responsibility | Task |
|---|---|---|
| `legacy/**` | Old app, reference only | 1 |
| `package.json` | Single root package: deps + scripts | 1 → 7 |
| `.gitignore` | Adds `coverage/` | 1 |
| `tsconfig.json` | Strict compiler options, `@/*` alias | 2 |
| `vite.config.ts`, `index.html` | Vite app entry, `@/` alias | 2 |
| `vitest.config.ts` | jsdom, test globs, setup, coverage thresholds | 2 |
| `src/main.tsx`, `src/App.tsx` | Minimal app scaffold | 2 |
| `tests/support/setup.ts`, `server.ts`, `handlers.ts` | jest-dom, MSW server lifecycle | 2 |
| `tests/App.test.tsx`, `tests/support/server.test.ts` | Scaffold + MSW behaviour tests | 2 |
| `.prettierrc.json`, `.prettierignore` | Formatting rules | 3 |
| `tests/lint/prettier.test.ts` | Proves formatting rules | 3 |
| `eslint.config.ts` | All lint rules | 4, 5 |
| `tests/support/lint.ts` | `lintViolations` helper over virtual files | 4 |
| `tests/lint/common.test.ts`, `tests/lint/frontend.test.ts` | Prove each lint rule | 4, 5 |
| `scripts/lib/missingTests.ts`, `scripts/check-tests.ts` | Test-existence check | 6 |
| `tests/scripts/lib/missingTests.test.ts` | Proves the mapping | 6 |
| `lefthook.yml`, `.github/workflows/ci.yml`, `CLAUDE.md` | Gates + agent instructions | 7 |

---

### Task 1: Move the legacy app and create the Bun package

**Files:**
- Move: `src/`, `tools/`, `package.json`, `yarn.lock`, `webpack.config.dev.js`,
  `webpack.config.prod.js`, `server.js`, `wallaby.conf.js`, `Procfile`, `CONTRIBUTING.md` → `legacy/`
- Delete: `appveyor.yml`
- Create: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: a root `package.json` (`"type": "module"`, empty `scripts`) that later tasks extend;
  `bun.lock`

- [ ] **Step 1: Check Bun is installed**

Run: `bun --version`
Expected: a version ≥ 1.2. If the command is not found, **stop and ask the user** to install Bun
(`brew install oven-sh/bun/bun` or `curl -fsSL https://bun.sh/install | bash`). Do not install it
yourself.

- [ ] **Step 2: Create the branch**

```bash
git checkout docs/react-guidelines
git checkout -b tooling/1-legacy-bun-package
```

Later tasks create their branch from the previous task's branch in the same way (see Global
Constraints).

- [ ] **Step 3: Move the legacy app and delete AppVeyor**

```bash
mkdir legacy
git mv src tools package.json yarn.lock webpack.config.dev.js webpack.config.prod.js \
  server.js wallaby.conf.js Procfile CONTRIBUTING.md legacy/
git rm -q appveyor.yml
```

`data/`, `LICENSE`, `docs/` and `.gitignore` stay at the root.

- [ ] **Step 4: Create the root `package.json`**

```json
{
  "name": "react-resume",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "license": "MIT",
  "scripts": {}
}
```

- [ ] **Step 5: Add `coverage/` to `.gitignore`**

Append a `coverage/` line to the existing root `.gitignore`; keep every existing entry.

- [ ] **Step 6: Verify the package installs**

Run: `bun install`
Expected: exits 0 and creates `bun.lock`.

Run: `git status --short`
Expected: renames into `legacy/`, `D appveyor.yml`, new `package.json`, `bun.lock`, modified
`.gitignore` (plus the untracked `.idea/`, which must not be added).

- [ ] **Step 7: Commit**

```bash
git add legacy package.json bun.lock .gitignore
git commit -m "chore: move legacy app to legacy/ and start a Bun package

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Vite + React + Vitest scaffold

**Files:**
- Create: `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `src/main.tsx`,
  `src/App.tsx`, `tests/support/setup.ts`, `tests/support/server.ts`, `tests/support/handlers.ts`,
  `tests/support/server.test.ts`, `tests/App.test.tsx`
- Modify: `package.json` (deps, scripts)

**Interfaces:**
- Consumes: root `package.json` from Task 1
- Produces:
  - `export const App: () => JSX.Element` in `src/App.tsx` (renders a `<main>` landmark)
  - `export const server: SetupServerApi` in `tests/support/server.ts`
  - `export const handlers: ReadonlyArray<RequestHandler>` in `tests/support/handlers.ts`
  - `@/` alias → `src/` in TypeScript, Vite and Vitest
  - scripts `dev`, `build`, `typecheck`, `test`, `test:watch`

- [ ] **Step 1: Install dependencies**

```bash
bun add react react-dom
bun add -d typescript@~6.0 vite @vitejs/plugin-react vitest @vitest/coverage-v8 jsdom \
  @testing-library/react @testing-library/dom @testing-library/jest-dom msw \
  @types/react @types/react-dom @types/node
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vite/client", "node"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src", "tests", "scripts", "*.ts"]
}
```

- [ ] **Step 3: Create `vite.config.ts`**

```ts
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,tsx}'],
      setupFiles: ['tests/support/setup.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx', 'src/gql/**'],
        thresholds: { lines: 90, branches: 90 },
      },
    },
  }),
)
```

- [ ] **Step 5: Create the MSW test server and setup file**

`tests/support/handlers.ts`:

```ts
import type { RequestHandler } from 'msw'

// Default handlers shared by all tests. Sub-project 2 adds the ResumePage GraphQL handlers.
export const handlers: ReadonlyArray<RequestHandler> = []
```

`tests/support/server.ts`:

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

`tests/support/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})
```

- [ ] **Step 6: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "typecheck": "tsc --noEmit",
  "test": "vitest run --coverage",
  "test:watch": "vitest"
}
```

- [ ] **Step 7: Write the failing tests**

`tests/support/server.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'

describe('MSW test server', () => {
  it('rejects and reports requests that have no handler', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(fetch('http://localhost/unhandled')).rejects.toThrow()
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('without a matching request handler'),
    )

    consoleError.mockRestore()
  })
})
```

`tests/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '@/App'

describe('App', () => {
  it('renders the main landmark', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

- [ ] **Step 8: Run the tests to verify they fail**

Run: `bunx vitest run`
Expected: `tests/App.test.tsx` FAILS with an error resolving `@/App`. `tests/support/server.test.ts`
PASSES. (If the server test fails because MSW's message differs, print the actual
`consoleError.mock.calls` and update the expected substring to MSW's current wording; the
behaviour under test is that the request rejects *and* MSW reports it.)

- [ ] **Step 9: Implement the scaffold**

`src/App.tsx`:

```tsx
export const App = () => <main />
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'

const container = document.getElementById('root')

if (container === null) {
  throw new Error('Missing #root element in index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`index.html`:

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hugo Cantacuzene</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: Run the tests, typecheck and build**

Run: `bun run test`
Expected: 2 tests PASS; coverage table shows `App.tsx` at 100%; no threshold error.

Run: `bun run typecheck`
Expected: exits 0.

Run: `bun run build`
Expected: exits 0 and writes `dist/`.

- [ ] **Step 11: Commit**

```bash
git add package.json bun.lock tsconfig.json vite.config.ts vitest.config.ts index.html src tests
git commit -m "feat: add Vite + React + Vitest scaffold with MSW test server

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Prettier

**Files:**
- Create: `.prettierrc.json`, `.prettierignore`, `tests/lint/prettier.test.ts`
- Modify: `package.json` (dep, scripts); all files reformatted by `bun run format`

**Interfaces:**
- Consumes: Vitest setup from Task 2
- Produces: scripts `format`, `format:check`

- [ ] **Step 1: Install Prettier**

```bash
bun add -d prettier
```

- [ ] **Step 2: Write the failing test**

`tests/lint/prettier.test.ts`:

```ts
// @vitest-environment node
import { format, resolveConfig } from 'prettier'
import { describe, expect, it } from 'vitest'

const SAMPLE_PATH = 'src/sample.ts'

const formatTs = async (code: string): Promise<string> => {
  const options = await resolveConfig(SAMPLE_PATH)
  return format(code, { ...options, filepath: SAMPLE_PATH })
}

describe('Prettier config', () => {
  it('removes semicolons', async () => {
    expect(await formatTs('const a = 1;\n')).toBe('const a = 1\n')
  })

  it('uses single quotes', async () => {
    expect(await formatTs('const a = "x"\n')).toBe("const a = 'x'\n")
  })

  it('adds trailing commas to multi-line literals', async () => {
    const longArray = `const values = [${'"aaaaaaaaaa", '.repeat(10)}]\n`

    expect(await formatTs(longArray)).toContain("'aaaaaaaaaa',\n]")
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `bunx vitest run tests/lint/prettier.test.ts`
Expected: FAIL — "removes semicolons" receives `'const a = 1;\n'` and "uses single quotes" receives
double quotes (Prettier defaults).

- [ ] **Step 4: Add the config**

`.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

`.prettierignore`:

```
legacy/
data/
docs/
coverage/
dist/
bun.lock
.idea/
```

Add to `package.json` scripts:

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bunx vitest run tests/lint/prettier.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 6: Format the repo and check**

Run: `bun run format && bun run format:check`
Expected: `All matched files use Prettier code style!`

Run: `bun run test`
Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add -A -- . ':!.idea'
git commit -m "chore: add Prettier config (no semicolons) with tests

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: ESLint — common rules

**Files:**
- Create: `eslint.config.ts`, `tests/support/lint.ts`, `tests/lint/common.test.ts`
- Modify: `package.json` (deps, `lint` script)

**Interfaces:**
- Consumes: `tsconfig.json` (Task 2)
- Produces:
  - `export const VIRTUAL_FILES: { source: 'src/__lint__.ts'; api: 'src/api/__lint__.ts'; component: 'src/components/__lint__.tsx'; test: 'tests/__lint__.test.tsx'; config: '__lint__.config.ts' }`
  - `export const lintViolations: (filePath: VirtualFile, code: string) => Promise<ReadonlyArray<string>>` — rule ids of every error **and** warning (both fail `--max-warnings 0`); throws on parse errors
  - `export const isIgnored: (filePath: string) => Promise<boolean>`
  - script `lint`

The helper lints code samples through the **real** `eslint.config.ts`. Type-aware rules need each
file to belong to a TypeScript project, so the helper's own ESLint instance allows the virtual
paths via `projectService.allowDefaultProject`. This override exists only in the test helper. The
virtual paths must never exist on disk.

- [ ] **Step 1: Install ESLint and the common plugins**

```bash
bun add -d eslint@^9 jiti typescript-eslint eslint-plugin-functional eslint-plugin-import \
  eslint-config-prettier
```

(`jiti` lets ESLint load `eslint.config.ts`.)

- [ ] **Step 2: Write the lint helper**

`tests/support/lint.ts`:

```ts
import { ESLint } from 'eslint'

// Virtual files linted by the rule tests. They must never exist on disk.
export const VIRTUAL_FILES = {
  source: 'src/__lint__.ts',
  api: 'src/api/__lint__.ts',
  component: 'src/components/__lint__.tsx',
  test: 'tests/__lint__.test.tsx',
  config: '__lint__.config.ts',
} as const

type VirtualFile = (typeof VIRTUAL_FILES)[keyof typeof VIRTUAL_FILES]

const eslint = new ESLint({
  overrideConfig: {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: Object.values(VIRTUAL_FILES),
          defaultProject: 'tsconfig.json',
        },
      },
    },
  },
})

export const lintViolations = async (
  filePath: VirtualFile,
  code: string,
): Promise<ReadonlyArray<string>> => {
  const [result] = await eslint.lintText(code, { filePath })

  if (result === undefined) {
    throw new Error(`ESLint returned no result for ${filePath}`)
  }

  const fatal = result.messages.find((message) => message.fatal === true)

  if (fatal !== undefined) {
    throw new Error(`ESLint could not parse ${filePath}: ${fatal.message}`)
  }

  return result.messages.map((message) => message.ruleId ?? 'unknown')
}

export const isIgnored = (filePath: string): Promise<boolean> => eslint.isPathIgnored(filePath)
```

- [ ] **Step 3: Write the failing rule tests**

`tests/lint/common.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isIgnored, lintViolations, VIRTUAL_FILES } from '../support/lint'

const { source, test, config } = VIRTUAL_FILES

describe('ESLint common rules', { timeout: 30_000 }, () => {
  it('accepts compliant code', async () => {
    expect(
      await lintViolations(source, 'export const double = (n: number): number => n * 2\n'),
    ).toEqual([])
  })

  it('forbids let', async () => {
    expect(
      await lintViolations(source, 'let count = 1\nexport const next = count + 1\n'),
    ).toContain('functional/no-let')
  })

  it('forbids mutating data', async () => {
    const code = [
      'export const build = (): ReadonlyArray<number> => {',
      '  const values: number[] = []',
      '  values.push(1)',
      '  return values',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(source, code)).toContain('functional/immutable-data')
  })

  it('forbids loops', async () => {
    expect(
      await lintViolations(source, 'for (const x of [1, 2]) {\n  console.log(x)\n}\n'),
    ).toContain('functional/no-loop-statements')
  })

  it('forbids classes', async () => {
    expect(await lintViolations(source, 'export class Counter {}\n')).toContain(
      'functional/no-classes',
    )
  })

  it('forbids this', async () => {
    expect(
      await lintViolations(
        source,
        'export function read(this: unknown): unknown {\n  return this\n}\n',
      ),
    ).toContain('functional/no-this-expressions')
  })

  it('requires readonly parameters', async () => {
    expect(
      await lintViolations(source, 'export const count = (xs: string[]): number => xs.length\n'),
    ).toContain('functional/prefer-immutable-types')
  })

  it('accepts readonly parameters', async () => {
    expect(
      await lintViolations(
        source,
        'export const count = (xs: ReadonlyArray<string>): number => xs.length\n',
      ),
    ).toEqual([])
  })

  it('forbids any', async () => {
    expect(await lintViolations(source, 'export const value: any = 1\n')).toContain(
      '@typescript-eslint/no-explicit-any',
    )
  })

  it('forbids default exports', async () => {
    expect(await lintViolations(source, 'export default 1\n')).toContain(
      'import/no-default-export',
    )
  })

  it('allows default exports in tool config files', async () => {
    expect(await lintViolations(config, 'export default {}\n')).toEqual([])
  })

  it('forbids snapshot tests', async () => {
    const code = [
      "import { expect, it } from 'vitest'",
      '',
      "it('renders', () => {",
      "  expect('x').toMatchSnapshot()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('no-restricted-syntax')
  })

  it('forbids mocking own modules', async () => {
    expect(
      await lintViolations(test, "import { vi } from 'vitest'\n\nvi.mock('@/api/graphql')\n"),
    ).toContain('no-restricted-syntax')
  })

  it('allows mocking third-party modules', async () => {
    expect(
      await lintViolations(
        test,
        "import { vi } from 'vitest'\n\nvi.mock('highcharts-react-official')\n",
      ),
    ).toEqual([])
  })

  it('ignores the legacy folder', async () => {
    expect(await isIgnored('legacy/src/index.js')).toBe(true)
  })
})
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `bunx vitest run tests/lint/common.test.ts`
Expected: FAIL — ESLint reports it could not find a config file.

- [ ] **Step 5: Write `eslint.config.ts` (common rules)**

```ts
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
```

Add to `package.json` scripts:

```json
"lint": "eslint . --max-warnings 0"
```

- [ ] **Step 6: Run the rule tests to verify they pass**

Run: `bunx vitest run tests/lint/common.test.ts`
Expected: 15 tests PASS.

- [ ] **Step 7: Lint the repo and fix violations**

Run: `bun run lint`
Expected: exits 0. If existing files from Tasks 2–3 violate a rule, fix the **code** to comply
(for example `String(n)` instead of a number in a template literal); never disable a rule to pass.

Run: `bun run typecheck && bun run test`
Expected: exits 0, all tests PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json bun.lock eslint.config.ts tests
git commit -m "chore: add ESLint common rules with rule tests

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: ESLint — frontend rules

**Files:**
- Modify: `eslint.config.ts`, `package.json` (deps)
- Create: `tests/lint/frontend.test.ts`

**Interfaces:**
- Consumes: `lintViolations`, `VIRTUAL_FILES` from `tests/support/lint.ts` (Task 4)
- Produces: final `eslint.config.ts`

- [ ] **Step 1: Install the frontend plugins**

```bash
bun add -d eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-react-prefer-function-component eslint-plugin-testing-library \
  eslint-plugin-jest-dom
```

- [ ] **Step 2: Write the failing rule tests**

`tests/lint/frontend.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { lintViolations, VIRTUAL_FILES } from '../support/lint'

const { source, api, component, test } = VIRTUAL_FILES

describe('ESLint frontend rules', { timeout: 30_000 }, () => {
  it('accepts a compliant component', async () => {
    expect(
      await lintViolations(
        component,
        'export const Title = ({ text }: Readonly<{ text: string }>) => (\n  <h1 className="title">{text}</h1>\n)\n',
      ),
    ).toEqual([])
  })

  it('forbids class components', async () => {
    const code = [
      "import { Component } from 'react'",
      '',
      'export class Legacy extends Component {',
      '  render() {',
      '    return null',
      '  }',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(component, code)).toContain(
      'react-prefer-function-component/react-prefer-function-component',
    )
  })

  it('enforces the rules of hooks', async () => {
    const code = [
      "import { useEffect } from 'react'",
      '',
      'export const Tracker = ({ id }: Readonly<{ id: string }>) => {',
      '  if (id) {',
      '    useEffect(() => undefined)',
      '  }',
      '  return null',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(component, code)).toContain('react-hooks/rules-of-hooks')
  })

  it('enforces exhaustive hook dependencies, in .ts hooks too', async () => {
    const code = [
      "import { useEffect } from 'react'",
      '',
      'export const useTracker = (id: string): void => {',
      '  useEffect(() => {',
      '    console.log(id)',
      '  }, [])',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(source, code)).toContain('react-hooks/exhaustive-deps')
  })

  it('forbids fetch outside src/api', async () => {
    expect(
      await lintViolations(source, "export const load = (): Promise<Response> => fetch('/x')\n"),
    ).toContain('no-restricted-globals')
  })

  it('allows fetch in src/api', async () => {
    expect(
      await lintViolations(api, "export const load = (): Promise<Response> => fetch('/x')\n"),
    ).toEqual([])
  })

  it('forbids hard-coded text in components', async () => {
    expect(await lintViolations(component, 'export const Greeting = () => <p>Hello</p>\n')).toContain(
      'react/jsx-no-literals',
    )
  })

  it('accepts a compliant test', async () => {
    const code = [
      "import '@testing-library/jest-dom/vitest'",
      "import { render, screen } from '@testing-library/react'",
      "import { expect, it } from 'vitest'",
      '',
      "it('renders the main landmark', () => {",
      '  render(<main />)',
      '',
      "  expect(screen.getByRole('main')).toBeInTheDocument()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toEqual([])
  })

  it('forbids getByTestId', async () => {
    const code = [
      "import '@testing-library/jest-dom/vitest'",
      "import { render, screen } from '@testing-library/react'",
      "import { expect, it } from 'vitest'",
      '',
      "it('renders', () => {",
      '  render(<main />)',
      '',
      "  expect(screen.getByTestId('main')).toBeInTheDocument()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('no-restricted-syntax')
  })

  it('enforces screen queries', async () => {
    const code = [
      "import { render } from '@testing-library/react'",
      "import { it } from 'vitest'",
      '',
      "it('renders', () => {",
      '  const { getByRole } = render(<main />)',
      "  getByRole('main')",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('testing-library/prefer-screen-queries')
  })

  it('enforces jest-dom matchers', async () => {
    const code = [
      "import '@testing-library/jest-dom/vitest'",
      "import { render, screen } from '@testing-library/react'",
      "import { expect, it } from 'vitest'",
      '',
      "it('renders', () => {",
      '  render(<main />)',
      '',
      "  expect(screen.queryByRole('main')).not.toBeNull()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('jest-dom/prefer-in-document')
  })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `bunx vitest run tests/lint/frontend.test.ts`
Expected: FAIL — "forbids class components", "enforces the rules of hooks", "enforces exhaustive
hook dependencies", "forbids fetch outside src/api", "forbids hard-coded text", "forbids
getByTestId", "enforces screen queries" and "enforces jest-dom matchers" fail (rules not
configured). "forbids class components" may already report `functional/no-classes` but not the
React rule. The compliant cases pass.

- [ ] **Step 4: Replace `eslint.config.ts` with the final config**

```ts
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
    selector: 'CallExpression[callee.property.name=/^toMatch(Inline)?Snapshot$/]',
    message: 'Snapshot tests are not allowed: assert on behaviour (docs/guidelines/common.md §4).',
  },
  {
    selector:
      "CallExpression[callee.object.name='vi'][callee.property.name=/^(mock|doMock)$/][arguments.0.value=/^@\\W/]",
    message: 'Do not mock own modules; mock only at the edges (docs/guidelines/common.md §4).',
  },
]

// docs/guidelines/frontend.md §4
const frontendTestRestrictions = [
  {
    selector: 'CallExpression[callee.property.name=/ByTestId$/], CallExpression[callee.name=/ByTestId$/]',
    message: 'Query by role, label or text instead of test ids (docs/guidelines/frontend.md §4).',
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

  // docs/guidelines/frontend.md §1–§2: components and hooks
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    plugins: { 'react-prefer-function-component': preferFunctionComponent },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react-prefer-function-component/react-prefer-function-component': 'error',
    },
  },

  // docs/guidelines/frontend.md §2: fetch only in src/api/
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/api/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Call fetch only from src/api/ (docs/guidelines/frontend.md §2).' },
      ],
    },
  },

  // docs/guidelines/frontend.md §3: no hard-coded text
  {
    files: ['src/**/*.tsx'],
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: true }],
    },
  },

  // docs/guidelines/frontend.md §4 and common.md §4: tests
  { ...testingLibrary.configs['flat/react'], files: ['tests/**/*.{ts,tsx}'] },
  { ...jestDom.configs['flat/recommended'], files: ['tests/**/*.{ts,tsx}'] },
  {
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', ...commonTestRestrictions, ...frontendTestRestrictions],
    },
  },

  prettier,
)
```

The spec's `react/jsx-no-literals` exception for `LoadError` is **not** added here: that component
does not exist yet. Sub-project 2 adds a block scoped to its single file when it creates it.

- [ ] **Step 5: Run all rule tests to verify they pass**

Run: `bunx vitest run tests/lint`
Expected: all tests in `common.test.ts`, `frontend.test.ts` and `prettier.test.ts` PASS.

If a "compliant" sample reports an unexpected rule, read the rule's docs: fix the **sample** only if
it genuinely violates a guideline; otherwise report it back rather than disabling the rule.

- [ ] **Step 6: Lint, typecheck, test the repo**

Run: `bun run format && bun run lint && bun run typecheck && bun run test`
Expected: all exit 0. Fix code (not rules) for any violation in existing files.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock eslint.config.ts tests
git commit -m "chore: add ESLint frontend rules (React, hooks, Testing Library) with rule tests

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: `check-tests` script

**Files:**
- Create: `scripts/lib/missingTests.ts`, `scripts/check-tests.ts`,
  `tests/scripts/lib/missingTests.test.ts`
- Modify: `package.json` (`check:tests` script)

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  - `export type MissingTest = Readonly<{ source: string; expectedTest: string }>`
  - `export const missingTests: (sourceFiles: ReadonlyArray<string>, testFiles: ReadonlyArray<string>) => ReadonlyArray<MissingTest>` — paths are relative to `src/` and `tests/`, with `/` separators
  - script `check:tests`

Rules (from `docs/guidelines/frontend.md` §4): every `*.tsx` and every `*.utils.ts` under `src/`
needs `tests/<same path>` with `.tsx` → `.test.tsx` and `.utils.ts` → `.utils.test.ts`.
`main.tsx` and `gql/**` are exempt.

- [ ] **Step 1: Write the failing test**

`tests/scripts/lib/missingTests.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { missingTests } from '../../../scripts/lib/missingTests'

describe('missingTests', () => {
  it('returns nothing when every component has its test', () => {
    expect(missingTests(['App.tsx'], ['App.test.tsx'])).toEqual([])
  })

  it('reports a component without a test at its mirrored path', () => {
    expect(missingTests(['components/Header/Header.tsx'], [])).toEqual([
      {
        source: 'components/Header/Header.tsx',
        expectedTest: 'components/Header/Header.test.tsx',
      },
    ])
  })

  it('requires tests for utils files', () => {
    expect(missingTests(['components/Skills/Skills.utils.ts'], [])).toEqual([
      {
        source: 'components/Skills/Skills.utils.ts',
        expectedTest: 'components/Skills/Skills.utils.test.ts',
      },
    ])
  })

  it('does not require tests for plain modules', () => {
    expect(missingTests(['api/graphql.ts', 'hooks/useResumePage.ts'], [])).toEqual([])
  })

  it('exempts the entry point and generated code', () => {
    expect(missingTests(['main.tsx', 'gql/Generated.tsx'], [])).toEqual([])
  })

  it('rejects a test that is not at the mirrored path', () => {
    expect(
      missingTests(['components/Header/Header.tsx'], ['components/Header.test.tsx']),
    ).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bunx vitest run tests/scripts`
Expected: FAIL — cannot resolve `../../../scripts/lib/missingTests`.

- [ ] **Step 3: Implement the pure mapping**

`scripts/lib/missingTests.ts`:

```ts
export type MissingTest = Readonly<{ source: string; expectedTest: string }>

const EXEMPT_FILES: ReadonlySet<string> = new Set(['main.tsx'])
const EXEMPT_DIRECTORIES: ReadonlyArray<string> = ['gql/']

const requiresTest = (file: string): boolean =>
  !EXEMPT_FILES.has(file) &&
  !EXEMPT_DIRECTORIES.some((directory) => file.startsWith(directory)) &&
  (file.endsWith('.tsx') || file.endsWith('.utils.ts'))

const toTestPath = (file: string): string => file.replace(/\.(tsx|ts)$/, '.test.$1')

export const missingTests = (
  sourceFiles: ReadonlyArray<string>,
  testFiles: ReadonlyArray<string>,
): ReadonlyArray<MissingTest> => {
  const existingTests: ReadonlySet<string> = new Set(testFiles)

  return sourceFiles
    .filter(requiresTest)
    .map((source) => ({ source, expectedTest: toTestPath(source) }))
    .filter(({ expectedTest }) => !existingTests.has(expectedTest))
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bunx vitest run tests/scripts`
Expected: 6 tests PASS.

- [ ] **Step 5: Implement the CLI entry point**

`scripts/check-tests.ts`:

```ts
import { existsSync, readdirSync } from 'node:fs'
import { sep } from 'node:path'
import { missingTests } from './lib/missingTests'

const listFiles = (directory: string): ReadonlyArray<string> =>
  existsSync(directory)
    ? readdirSync(directory, { recursive: true, encoding: 'utf8' }).map((file) =>
        file.split(sep).join('/'),
      )
    : []

const missing = missingTests(listFiles('src'), listFiles('tests'))

if (missing.length > 0) {
  console.error('Missing tests (docs/guidelines/frontend.md §4):')
  missing.forEach(({ source, expectedTest }) => {
    console.error(`  src/${source} → tests/${expectedTest}`)
  })
  process.exit(1)
}

console.log('check-tests: every component and utils file has a test')
```

Add to `package.json` scripts:

```json
"check:tests": "bun scripts/check-tests.ts"
```

- [ ] **Step 6: Verify the script end to end**

Run: `bun run check:tests`
Expected: `check-tests: every component and utils file has a test`, exit 0.

Run:

```bash
printf 'export const Untested = () => <div />\n' > src/Untested.tsx
bun run check:tests; echo "exit $?"
rm src/Untested.tsx
```

Expected: prints `src/Untested.tsx → tests/Untested.test.tsx` and `exit 1`.

- [ ] **Step 7: Format, lint, typecheck, test**

Run: `bun run format && bun run lint && bun run typecheck && bun run test`
Expected: all exit 0.

- [ ] **Step 8: Commit**

```bash
git add package.json scripts tests
git commit -m "chore: add check-tests script enforcing a test per component and utils file

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: `verify`, pre-commit, CI and `CLAUDE.md`

**Files:**
- Create: `lefthook.yml`, `.github/workflows/ci.yml`, `CLAUDE.md`
- Modify: `package.json` (dep, `verify` and `prepare` scripts)

**Interfaces:**
- Consumes: scripts `format:check`, `lint`, `typecheck`, `check:tests`, `test` (Tasks 2–6)
- Produces: script `verify`; a pre-commit hook that rejects failing commits; CI workflow

- [ ] **Step 1: Add the `verify` script and check it passes**

Add to `package.json` scripts:

```json
"verify": "bun run format:check && bun run lint && bun run typecheck && bun run check:tests && bun run test",
"prepare": "lefthook install"
```

Run: `bun run verify`
Expected: every step passes, exit 0.

- [ ] **Step 2: Install Lefthook and write its config**

```bash
bun add -d lefthook
```

`lefthook.yml`:

```yaml
pre-commit:
  piped: true
  jobs:
    - name: format staged files
      glob: '*.{ts,tsx,js,json,md,yml,yaml,html,css,scss}'
      run: bunx prettier --write --ignore-unknown {staged_files}
      stage_fixed: true
    - name: lint staged files
      glob: '*.{ts,tsx}'
      run: bunx eslint --fix --no-warn-ignored {staged_files}
      stage_fixed: true
    - name: verify
      run: bun run verify
```

Run: `bunx lefthook install`
Expected: `.git/hooks/pre-commit` exists.

- [ ] **Step 3: Prove the hook rejects a failing commit**

```bash
printf 'export const Untested = () => <div />\n' > src/Untested.tsx
git add src/Untested.tsx
git commit -m "test: should be rejected"; echo "exit $?"
```

Expected: the `verify` job fails at `check:tests` listing `src/Untested.tsx`, and `exit 1`. No
commit is created (`git log -1` still shows Task 6's commit).

Clean up:

```bash
git reset -q src/Untested.tsx
rm src/Untested.tsx
```

- [ ] **Step 4: Write the CI workflow**

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [master]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run verify
```

- [ ] **Step 5: Write `CLAUDE.md`**

```markdown
# react-resume

Migration in progress. The old app lives in `legacy/`: reference only, never built, edited or
linted.

## Mandatory guidelines

- [docs/guidelines/common.md](docs/guidelines/common.md): all TypeScript code
- [docs/guidelines/frontend.md](docs/guidelines/frontend.md): React frontend
- [docs/guidelines/backend.md](docs/guidelines/backend.md): Bun backend

## Commands

- `bun run verify`: every check; runs on pre-commit and in CI, and must pass
- `bun run dev`: start Vite
- `bun run test`: Vitest with coverage
```

- [ ] **Step 6: Final verification**

Run: `bun run format && bun run verify`
Expected: exit 0.

- [ ] **Step 7: Commit (runs the hook for real)**

```bash
git add package.json bun.lock lefthook.yml .github CLAUDE.md
git commit -m "chore: run verify on pre-commit and in CI, add CLAUDE.md

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

Expected: the pre-commit hook runs all three jobs, they pass, and the commit is created.
