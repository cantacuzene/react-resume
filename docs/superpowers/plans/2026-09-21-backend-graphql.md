# Backend (Bun + GraphQL) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy Express JSON server with a Bun + GraphQL Yoga API serving typed
resume content and UI translations in French and English, with every rule enforced and tested.

**Architecture:** The package splits into `src/client/` (the existing Vite scaffold, moved),
`src/server/` (SDL schema, generated types, typed content modules, pure resolvers, a Yoga server
built by `createServer(config)`, and a Bun entry point) and `src/shared/` (runtime-neutral code,
starting with `Result`). Tests mirror `src/` under `tests/`, run under the existing Vitest setup
(`// @vitest-environment node` for server code) and share the 90% coverage gate.

**Tech Stack:** Bun 1.4.2, TypeScript `~6.0`, GraphQL Yoga, `@graphql-tools/schema`,
`graphql-scalars` (`DateResolver`), GraphQL Code Generator (`typescript`, `typescript-resolvers`),
Vitest 5, ESLint 9, Prettier, Lefthook.

**Spec:** `docs/superpowers/specs/2026-09-21-backend-graphql-design.md`, applying
`docs/guidelines/common.md` and `docs/guidelines/backend.md`.

## Global Constraints

- One package at the repo root. Layout: `src/client/`, `src/server/`, `src/shared/`; tests in
  `tests/` mirroring `src/` exactly (`src/server/yoga.ts` → `tests/server/yoga.test.ts`).
- `@/*` maps to `src/*`. Tests import sources through `@/`, never `../src/...`.
- `legacy/` is never built, installed, linted, formatted or tested.
- No semicolons, single quotes, trailing commas, 100-column lines, 2-space indent.
- Named exports only (except `*.config.ts`). No classes, no `let`, no loops, no mutation,
  readonly parameters, `type` not `interface`.
- Server and shared tests start with `// @vitest-environment node`.
- Coverage ≥ 90% lines and branches over `src/**`, excluding `src/client/main.tsx`,
  `src/server/main.ts` and `src/*/gql/**`.
- Generated code lives in `src/server/gql/`, is committed, and is never edited by hand.
- Dates are TypeScript `Date` values at UTC month starts, sent as the ISO `Date` scalar.
- Never disable or weaken a lint rule or test to make it pass; fix the code. If an installed tool
  version behaves differently from this plan (API or message wording), adapt minimally, keep the
  behaviour under test, and record the change in the task report.
- The Lefthook pre-commit hook runs `bun run verify`; never commit with `--no-verify`.
- Every commit message: a conventional subject, a blank line, then exactly
  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  ```
- One GitHub issue (label `enhancement`) lists every task as a checkbox. One branch and PR per
  task, **stacked**: task N's branch `backend/N-<slug>` is created from task N−1's branch (task 1
  from `docs/backend-graphql`), and its PR targets that branch with `Part of #<issue>` in the body
  (task 7: `Closes #<issue>`). Tick the task's box when its PR is opened. PRs are merged
  bottom-up. Slugs: `1-client-layout`, `2-shared-lint`, `3-schema-codegen`, `4-content`,
  `5-config`, `6-graphql-server`, `7-guidelines`.

### Spec clarifications made while planning

- `src/server/typeDefs.ts` (not in the spec's layout) reads `schema.graphql` once, so the schema
  test, the resolvers test and `yoga.ts` share one loader.
- The spec's "both languages have the same list lengths" applies to experiences, educations
  (same `id`s in the same order), skills, spoken languages and profile links. It does not apply to
  `about.cover` / `about.interests`: they are prose paragraphs, and the French cover has 8 against
  7 in English.
- **Nothing in the French content stays in English.** The legacy French data has untranslated
  section titles, experience titles and skill names; the content translates them all (tables in
  Task 4). `content/index.test.ts` fails if a translatable string is identical in both languages.
- Skills are listed per language (so their names can be translated); the content test checks both
  languages keep the same ratings in the same order.

## File Map

| File | Responsibility | Task |
|---|---|---|
| `src/client/App.tsx`, `src/client/main.tsx`, `tests/client/App.test.tsx` | Moved scaffold | 1 |
| `index.html`, `vitest.config.ts` | Entry path, coverage exclusions | 1 |
| `eslint.config.ts` | Client rules scoped to `src/client/**` (1); server/shared blocks (2) | 1, 2 |
| `tests/support/lint.ts`, `tests/lint/frontend.test.ts` | Virtual paths under `src/client/` | 1 |
| `scripts/lib/missingTests.ts`, `scripts/check-tests.ts`, `tests/scripts/lib/missingTests.test.ts` | Client/server/shared test mapping | 1 |
| `tests/lint/backend.test.ts` | Proves server/shared lint rules | 2 |
| `src/shared/result.ts`, `tests/shared/result.test.ts` | `Result` type | 2 |
| `src/server/schema.graphql`, `src/server/typeDefs.ts`, `tests/server/typeDefs.test.ts` | Schema | 3 |
| `codegen.config.ts`, `src/server/gql/types.ts` | Code generation | 3 |
| `src/server/content/{shared,fr,en,index}.ts`, `tests/server/content/index.test.ts` | Content | 4 |
| `src/server/config.utils.ts`, `tests/server/config.utils.test.ts` | Env parsing | 5 |
| `src/server/resolvers.ts`, `src/server/yoga.ts`, `src/server/main.ts` + tests | Server | 6 |
| `docs/guidelines/*.md`, `docs/superpowers/specs/2026-09-21-react-guidelines-design.md`, `CLAUDE.md` | Docs | 7 |

---

### Task 1: Move the client to `src/client/` and extend the test mapping

**Files:**
- Move: `src/App.tsx` → `src/client/App.tsx`, `src/main.tsx` → `src/client/main.tsx`,
  `tests/App.test.tsx` → `tests/client/App.test.tsx`
- Modify: `index.html`, `vitest.config.ts`, `eslint.config.ts`, `tests/support/lint.ts`,
  `tests/lint/frontend.test.ts`, `scripts/lib/missingTests.ts`, `scripts/check-tests.ts`,
  `tests/scripts/lib/missingTests.test.ts`

**Interfaces:**
- Consumes: the merged tooling on `docs/backend-graphql`
- Produces:
  - `export const App` at `@/client/App`
  - `VIRTUAL_FILES` in `tests/support/lint.ts` with `source: 'src/client/__lint__.ts'`,
    `api: 'src/client/api/__lint__.ts'`, `component: 'src/client/components/__lint__.tsx'`
    (`test` and `config` unchanged)
  - `missingTests(sourceFiles, testFiles)` with the client/server/shared rules below (same
    signature and `MissingTest` type as today)

- [ ] **Step 1: Create the branch**

```bash
git checkout docs/backend-graphql
git checkout -b backend/1-client-layout
```

- [ ] **Step 2: Write the failing mapping tests**

Replace `tests/scripts/lib/missingTests.test.ts` with:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { missingTests } from '../../../scripts/lib/missingTests'

describe('missingTests', () => {
  it('returns nothing when every client component has its test', () => {
    expect(missingTests(['client/App.tsx'], ['client/App.test.tsx'])).toEqual([])
  })

  it('reports a client component without a test at its mirrored path', () => {
    expect(missingTests(['client/components/Header/Header.tsx'], [])).toEqual([
      {
        source: 'client/components/Header/Header.tsx',
        expectedTest: 'client/components/Header/Header.test.tsx',
      },
    ])
  })

  it('requires tests for client utils files', () => {
    expect(missingTests(['client/components/Skills/Skills.utils.ts'], [])).toEqual([
      {
        source: 'client/components/Skills/Skills.utils.ts',
        expectedTest: 'client/components/Skills/Skills.utils.test.ts',
      },
    ])
  })

  it('does not require tests for plain client modules', () => {
    expect(missingTests(['client/api/graphql.ts', 'client/hooks/useResumePage.ts'], [])).toEqual(
      [],
    )
  })

  it('requires a test for every server module', () => {
    expect(missingTests(['server/yoga.ts', 'server/content/index.ts'], [])).toEqual([
      { source: 'server/yoga.ts', expectedTest: 'server/yoga.test.ts' },
      { source: 'server/content/index.ts', expectedTest: 'server/content/index.test.ts' },
    ])
  })

  it('requires a test for every shared module', () => {
    expect(missingTests(['shared/result.ts'], [])).toEqual([
      { source: 'shared/result.ts', expectedTest: 'shared/result.test.ts' },
    ])
  })

  it('ignores non-TypeScript server files', () => {
    expect(missingTests(['server/schema.graphql'], [])).toEqual([])
  })

  it('exempts entry points, generated code and content data files', () => {
    expect(
      missingTests(
        [
          'client/main.tsx',
          'server/main.ts',
          'server/gql/types.ts',
          'client/gql/graphql.ts',
          'server/content/shared.ts',
          'server/content/fr.ts',
          'server/content/en.ts',
        ],
        [],
      ),
    ).toEqual([])
  })

  it('rejects a test that is not at the mirrored path', () => {
    expect(
      missingTests(['client/components/Header/Header.tsx'], ['client/components/Header.test.tsx']),
    ).toHaveLength(1)
  })
})
```

- [ ] **Step 3: Run the mapping tests to verify they fail**

Run: `bunx vitest run tests/scripts`
Expected: FAIL — the server, shared and exemption cases fail (current rules only know `*.tsx` /
`*.utils.ts` and the exact file `main.tsx`).

- [ ] **Step 4: Implement the new mapping**

Replace `scripts/lib/missingTests.ts` with:

```ts
export type MissingTest = Readonly<{ source: string; expectedTest: string }>

const EXEMPT_FILES: ReadonlySet<string> = new Set([
  'client/main.tsx',
  'server/main.ts',
  'server/content/shared.ts',
  'server/content/fr.ts',
  'server/content/en.ts',
])

// src/client/gql/, src/server/gql/: generated code
const GENERATED_FILE = /^[^/]+\/gql\//

const isClientComponentOrUtils = (file: string): boolean =>
  file.startsWith('client/') && (file.endsWith('.tsx') || file.endsWith('.utils.ts'))

const isServerOrSharedModule = (file: string): boolean =>
  (file.startsWith('server/') || file.startsWith('shared/')) && file.endsWith('.ts')

const requiresTest = (file: string): boolean =>
  !EXEMPT_FILES.has(file) &&
  !GENERATED_FILE.test(file) &&
  (isClientComponentOrUtils(file) || isServerOrSharedModule(file))

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

In `scripts/check-tests.ts`, change the two messages to:

```ts
  console.error('Missing tests (docs/guidelines/frontend.md §4, backend.md §2):')
```

```ts
console.log('check-tests: every component, utils, server and shared module has a test')
```

- [ ] **Step 5: Run the mapping tests to verify they pass**

Run: `bunx vitest run tests/scripts`
Expected: 9 tests PASS.

- [ ] **Step 6: Move the client files**

```bash
mkdir -p src/client tests/client
git mv src/App.tsx src/client/App.tsx
git mv src/main.tsx src/client/main.tsx
git mv tests/App.test.tsx tests/client/App.test.tsx
```

In `src/client/main.tsx` and `tests/client/App.test.tsx`, change `import { App } from '@/App'` to
`import { App } from '@/client/App'`.

In `index.html`, change the script tag to:

```html
    <script type="module" src="/src/client/main.tsx"></script>
```

In `vitest.config.ts`, change the coverage `exclude` to:

```ts
        exclude: ['src/client/main.tsx', 'src/server/main.ts', 'src/*/gql/**'],
```

- [ ] **Step 7: Scope the client ESLint rules to `src/client/`**

In `eslint.config.ts`:
- `globalIgnores`: replace `'src/gql/**'` with `'src/*/gql/**'`.
- Hooks block: `files: ['src/client/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}']`.
- `fetch` block: comment `// docs/guidelines/frontend.md §2: fetch only in src/client/api/`,
  `files: ['src/client/**/*.{ts,tsx}']`, `ignores: ['src/client/api/**']`, and both messages
  `'Call fetch only from src/client/api/ (docs/guidelines/frontend.md §2).'`
- Components block: `files: ['src/client/**/*.tsx']`.

In `tests/support/lint.ts`, change `VIRTUAL_FILES` to:

```ts
export const VIRTUAL_FILES = {
  source: 'src/client/__lint__.ts',
  api: 'src/client/api/__lint__.ts',
  component: 'src/client/components/__lint__.tsx',
  test: 'tests/__lint__.test.tsx',
  config: '__lint__.config.ts',
} as const
```

In `tests/lint/frontend.test.ts`, rename the test titles that mention `src/api` to
`src/client/api` (5 titles: "forbids fetch outside src/client/api", "allows fetch in
src/client/api", "forbids globalThis.fetch outside src/client/api", "forbids window.fetch
outside src/client/api", "allows globalThis.fetch in src/client/api"). The code samples do not
change.

- [ ] **Step 8: Verify everything**

Run: `bunx vitest run tests/lint`
Expected: all lint rule tests PASS (the virtual files now sit under `src/client/`, where the
client rules apply).

Run: `bun run verify`
Expected: exit 0; `check-tests` prints
`check-tests: every component, utils, server and shared module has a test`.

Run: `bun run build`
Expected: exit 0 (Vite finds `/src/client/main.tsx`).

- [ ] **Step 9: Commit**

```bash
git add -A -- src tests scripts index.html vitest.config.ts eslint.config.ts
git commit -m "refactor: move the client to src/client and map server/shared tests

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Server and shared lint boundaries, and `Result`

**Files:**
- Modify: `eslint.config.ts`, `tests/support/lint.ts`
- Create: `tests/lint/backend.test.ts`, `src/shared/result.ts`, `tests/shared/result.test.ts`

**Interfaces:**
- Consumes: `lintViolations`, `VIRTUAL_FILES` (Task 1)
- Produces:
  - `VIRTUAL_FILES.server: 'src/server/__lint__.ts'`, `VIRTUAL_FILES.shared: 'src/shared/__lint__.ts'`
  - `export type Result<T, E> = Readonly<{ ok: true; value: T }> | Readonly<{ ok: false; error: E }>`
  - `export const ok: <T>(value: T) => Result<T, never>`
  - `export const err: <E>(error: E) => Result<never, E>`

- [ ] **Step 1: Create the branch**

```bash
git checkout -b backend/2-shared-lint
```

- [ ] **Step 2: Add the virtual files**

In `tests/support/lint.ts`, add two entries to `VIRTUAL_FILES` after `component`:

```ts
  server: 'src/server/__lint__.ts',
  shared: 'src/shared/__lint__.ts',
```

- [ ] **Step 3: Write the failing lint rule tests**

`tests/lint/backend.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { lintViolations, VIRTUAL_FILES } from '../support/lint'

const { server, shared } = VIRTUAL_FILES

describe('ESLint server and shared rules', { timeout: 30_000 }, () => {
  it('accepts a compliant server module', async () => {
    expect(
      await lintViolations(server, 'export const double = (n: number): number => n * 2\n'),
    ).toEqual([])
  })

  it('forbids React in server code', async () => {
    expect(
      await lintViolations(server, "import { useState } from 'react'\n\nexport const s = useState\n"),
    ).toContain('no-restricted-imports')
  })

  it('forbids client code in server code', async () => {
    expect(
      await lintViolations(server, "import { App } from '@/client/App'\n\nexport const a = App\n"),
    ).toContain('no-restricted-imports')
  })

  it('forbids DOM globals in server code', async () => {
    expect(
      await lintViolations(server, 'export const title = (): string => document.title\n'),
    ).toContain('no-restricted-globals')
  })

  it('does not apply client-only rules to server code', async () => {
    expect(
      await lintViolations(server, "export const load = (): Promise<Response> => fetch('/x')\n"),
    ).toEqual([])
  })

  it('accepts a compliant shared module', async () => {
    expect(
      await lintViolations(shared, 'export const isEven = (n: number): boolean => n % 2 === 0\n'),
    ).toEqual([])
  })

  it('forbids Bun in shared code', async () => {
    expect(
      await lintViolations(shared, 'export const version = (): string => Bun.version\n'),
    ).toContain('no-restricted-globals')
  })

  it('forbids server imports in shared code', async () => {
    expect(
      await lintViolations(shared, "import { x } from '@/server/x'\n\nexport const y = x\n"),
    ).toContain('no-restricted-imports')
  })

  it('forbids React in shared code', async () => {
    expect(
      await lintViolations(shared, "import { useState } from 'react'\n\nexport const s = useState\n"),
    ).toContain('no-restricted-imports')
  })

  it('forbids DOM globals in shared code', async () => {
    expect(
      await lintViolations(shared, 'export const width = (): number => window.innerWidth\n'),
    ).toContain('no-restricted-globals')
  })
})
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `bunx vitest run tests/lint/backend.test.ts`
Expected: FAIL — every "forbids" case fails (no server/shared rules yet); the two "accepts" cases
and "does not apply client-only rules" PASS.

- [ ] **Step 5: Add the server and shared blocks**

In `eslint.config.ts`, add after the components block (before the tests blocks):

```ts
  // docs/guidelines/backend.md §1: no React, client code or browser APIs on the server
  {
    files: ['src/server/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['react', 'react-dom'].map((name) => ({
            name,
            message: 'No React on the server (docs/guidelines/backend.md §1).',
          })),
          patterns: [
            {
              group: ['react-dom/*', '@/client/*'],
              message: 'The server never imports client code (docs/guidelines/backend.md §1).',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        ...['window', 'document', 'localStorage', 'sessionStorage'].map((name) => ({
          name,
          message: 'No browser APIs on the server (docs/guidelines/backend.md §1).',
        })),
      ],
    },
  },

  // docs/guidelines/common.md §3: src/shared is runtime-neutral
  {
    files: ['src/shared/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['react', 'react-dom', 'bun'].map((name) => ({
            name,
            message: 'src/shared is runtime-neutral (docs/guidelines/common.md §3).',
          })),
          patterns: [
            {
              group: ['@/client/*', '@/server/*', 'node:*'],
              message: 'src/shared imports nothing runtime-specific (docs/guidelines/common.md §3).',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        ...['Bun', 'window', 'document', 'process'].map((name) => ({
          name,
          message: 'src/shared is runtime-neutral (docs/guidelines/common.md §3).',
        })),
      ],
    },
  },
```

- [ ] **Step 6: Run the lint tests to verify they pass**

Run: `bunx vitest run tests/lint`
Expected: all tests in `backend.test.ts`, `common.test.ts`, `frontend.test.ts` and
`prettier.test.ts` PASS.

- [ ] **Step 7: Write the failing `Result` test**

`tests/shared/result.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { err, ok, type Result } from '@/shared/result'

const describeResult = (result: Result<number, string>): string =>
  result.ok ? `value ${String(result.value)}` : `error ${result.error}`

describe('Result', () => {
  it('wraps a value with ok', () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 })
  })

  it('wraps an error with err', () => {
    expect(err('boom')).toEqual({ ok: false, error: 'boom' })
  })

  it('narrows on the ok flag', () => {
    expect(describeResult(ok(2))).toBe('value 2')
    expect(describeResult(err('boom'))).toBe('error boom')
  })
})
```

- [ ] **Step 8: Run it to verify it fails**

Run: `bunx vitest run tests/shared`
Expected: FAIL — cannot resolve `@/shared/result`.

- [ ] **Step 9: Implement `Result`**

`src/shared/result.ts`:

```ts
// docs/guidelines/common.md §2: errors are values
export type Result<T, E> = Readonly<{ ok: true; value: T }> | Readonly<{ ok: false; error: E }>

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value })

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error })
```

- [ ] **Step 10: Verify and commit**

Run: `bunx vitest run tests/shared` — Expected: 3 tests PASS.
Run: `bun run verify` — Expected: exit 0.

```bash
git add eslint.config.ts tests src/shared
git commit -m "feat: add server/shared lint boundaries and the shared Result type

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: GraphQL schema and code generation

**Files:**
- Create: `src/server/schema.graphql`, `src/server/typeDefs.ts`, `tests/server/typeDefs.test.ts`,
  `codegen.config.ts`, `src/server/gql/types.ts` (generated)
- Modify: `package.json` (deps, `codegen`, `check:gql`, `verify`), `.prettierignore`

**Interfaces:**
- Consumes: `src/*/gql/**` already ignored by ESLint and coverage (Task 1)
- Produces:
  - `export const typeDefs: string` in `src/server/typeDefs.ts`
  - Generated in `src/server/gql/types.ts`: `Lang` (`'FR' | 'EN'`), `LinkKind`, `Resume`,
    `Profile`, `ProfileLink`, `About`, `Skill`, `Education`, `Experience`, `SpokenLanguage`,
    `Translations`, `SiteLanguage`, `Resolvers`, with `Date` fields typed as `Date`
  - scripts `codegen`, `check:gql`

- [ ] **Step 1: Create the branch and install dependencies**

```bash
git checkout -b backend/3-schema-codegen
bun add graphql graphql-scalars
bun add -d @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-resolvers
```

- [ ] **Step 2: Write the schema**

`src/server/schema.graphql`:

```graphql
scalar Date

enum Lang {
  FR
  EN
}

type Query {
  resume(lang: Lang!): Resume!
  translations(lang: Lang!): Translations!
  siteLanguages(lang: Lang!): [SiteLanguage!]!
}

type Resume {
  profile: Profile!
  about: About!
  skills: [Skill!]!
  educations: [Education!]!
  experiences: [Experience!]!
  spokenLanguages: [SpokenLanguage!]!
}

type Profile {
  name: String!
  jobTitle: String!
  location: String!
  email: String!
  links: [ProfileLink!]!
}

enum LinkKind {
  GITHUB
  LINKEDIN
  BADGES
}

type ProfileLink {
  kind: LinkKind!
  url: String!
  "Translated, e.g. \"My GitHub profile\""
  label: String!
}

type About {
  cover: [String!]!
  interests: [String!]!
}

type Skill {
  name: String!
  "0–100"
  rating: Int!
}

type Education {
  id: ID!
  year: Int!
  school: String!
  location: String!
  title: String!
}

type Experience {
  id: ID!
  title: String!
  company: String!
  start: Date!
  "null means the current position"
  end: Date
  description: String!
  stack: [String!]!
}

type SpokenLanguage {
  name: String!
  "0–1"
  rating: Float!
}

type Translations {
  sections: SectionTitles!
  header: HeaderLabels!
  timeline: TimelineLabels!
  aria: AriaLabels!
}

type SectionTitles {
  about: String!
  skills: String!
  education: String!
  languages: String!
  experiences: String!
}

type HeaderLabels {
  switchTo: String!
  emailMe: String!
}

type TimelineLabels {
  "Shown when Experience.end is null"
  present: String!
}

type AriaLabels {
  switchLanguage: String!
  retry: String!
  loading: String!
}

type SiteLanguage {
  code: Lang!
  "In the requested language, e.g. lang FR gives \"Anglais\" for EN"
  label: String!
}
```

- [ ] **Step 3: Write the codegen config and scripts**

`codegen.config.ts`:

```ts
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/server/schema.graphql',
  generates: {
    'src/server/gql/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars: { Date: 'Date' },
        enumsAsTypes: true,
        useTypeImports: true,
        immutableTypes: true,
      },
    },
  },
}

export default config
```

In `package.json` scripts, add:

```json
"codegen": "graphql-codegen --config codegen.config.ts",
"check:gql": "bun run codegen && git diff --exit-code -- src/server/gql",
```

and change `verify` to:

```json
"verify": "bun run format:check && bun run lint && bun run typecheck && bun run check:gql && bun run check:tests && bun run test",
```

Append to `.prettierignore`:

```
src/*/gql/
```

- [ ] **Step 4: Write the failing schema test**

`tests/server/typeDefs.test.ts`:

```ts
// @vitest-environment node
import { buildSchema, isEnumType, isScalarType } from 'graphql'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { Lang } from '@/server/gql/types'
import { typeDefs } from '@/server/typeDefs'

describe('typeDefs', () => {
  const schema = buildSchema(typeDefs)

  it('exposes the three ResumePage query fields', () => {
    expect(Object.keys(schema.getQueryType()?.getFields() ?? {})).toEqual([
      'resume',
      'translations',
      'siteLanguages',
    ])
  })

  it('declares the FR and EN languages', () => {
    const lang = schema.getType('Lang')

    expect(isEnumType(lang) ? lang.getValues().map(({ name }) => name) : []).toEqual(['FR', 'EN'])
  })

  it('declares a Date scalar', () => {
    expect(isScalarType(schema.getType('Date'))).toBe(true)
  })

  it('generates Lang as a string union', () => {
    // Checked by `tsc` (typecheck): fails to compile if codegen emits an enum
    expectTypeOf<Lang>().toEqualTypeOf<'FR' | 'EN'>()
  })
})
```

- [ ] **Step 5: Run it to verify it fails**

Run: `bunx vitest run tests/server/typeDefs.test.ts`
Expected: FAIL — cannot resolve `@/server/typeDefs` (and `@/server/gql/types`).

- [ ] **Step 6: Implement the loader and generate the types**

`src/server/typeDefs.ts`:

```ts
import { readFileSync } from 'node:fs'

// The SDL is the source of truth (docs/guidelines/backend.md); codegen reads the same file
export const typeDefs: string = readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8')
```

Run: `bun run codegen`
Expected: writes `src/server/gql/types.ts`; `grep -n "export type Lang" src/server/gql/types.ts`
shows a string union, not an `enum`.

- [ ] **Step 7: Run the tests and typecheck**

Run: `bunx vitest run tests/server/typeDefs.test.ts` — Expected: 4 tests PASS.
Run: `bun run typecheck` — Expected: exit 0.

- [ ] **Step 8: Prove `check:gql` catches stale code**

```bash
git add src/server codegen.config.ts package.json bun.lock .prettierignore tests/server
bun run check:gql; echo "exit $?"
```

Expected: `exit 0` (generated file matches what is staged).

```bash
printf '\ntype Probe {\n  x: Int\n}\n' >> src/server/schema.graphql
bun run check:gql; echo "exit $?"
git checkout -- src/server/schema.graphql src/server/gql
```

Expected: the diff of `src/server/gql/types.ts` is printed and `exit 1`; after the checkout
`git status --short src/server` shows only staged files.

- [ ] **Step 9: Verify and commit**

Run: `bun run verify` — Expected: exit 0.

```bash
git add src/server codegen.config.ts package.json bun.lock .prettierignore tests/server
git commit -m "feat: add the GraphQL schema and resolver type generation

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Typed content modules

**Files:**
- Create: `src/server/content/shared.ts`, `src/server/content/fr.ts`,
  `src/server/content/en.ts`, `src/server/content/index.ts`, `tests/server/content/index.test.ts`
- Delete: `data/`
- Modify: `.prettierignore` (remove the `data/` line)

**Interfaces:**
- Consumes: generated types from `@/server/gql/types` (Task 3)
- Produces:
  - `export type LangContent = Readonly<{ resume: Resume; translations: Translations; siteLanguages: ReadonlyArray<SiteLanguage> }>`
  - `export const content: Readonly<Record<Lang, LangContent>>` in `src/server/content/index.ts`

- [ ] **Step 1: Create the branch**

```bash
git checkout -b backend/4-content
```

- [ ] **Step 2: Write the failing content test**

`tests/server/content/index.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { content, type LangContent } from '@/server/content'

type Leaf = Readonly<{ path: string; value: unknown }>

const leaves = (value: unknown, path: string): ReadonlyArray<Leaf> => {
  if (Array.isArray(value)) {
    return value.flatMap((item: unknown, index) => leaves(item, `${path}[${String(index)}]`))
  }
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    return Object.entries(value).flatMap(([key, child]) => leaves(child, `${path}.${key}`))
  }
  return [{ path, value }]
}

const isUtcMonthStart = (date: Date): boolean =>
  date.getUTCDate() === 1 &&
  date.getUTCHours() === 0 &&
  date.getUTCMinutes() === 0 &&
  date.getUTCSeconds() === 0 &&
  date.getUTCMilliseconds() === 0

const { FR: fr, EN: en } = content

describe('content', () => {
  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('has no empty or blank string in %s', (lang, langContent) => {
    const blank = leaves(langContent, lang)
      .filter(({ value }) => typeof value === 'string' && value.trim() === '')
      .map(({ path }) => path)

    expect(blank).toEqual([])
  })

  it('lists the same experiences and educations in both languages', () => {
    expect(fr.resume.experiences.map(({ id }) => id)).toEqual(
      en.resume.experiences.map(({ id }) => id),
    )
    expect(fr.resume.educations.map(({ id }) => id)).toEqual(
      en.resume.educations.map(({ id }) => id),
    )
  })

  it('translates every translatable string', () => {
    const translatable = (langContent: LangContent): ReadonlyArray<Leaf> => [
      ...leaves(langContent.translations, 'translations'),
      ...leaves(langContent.siteLanguages.map(({ label }) => label), 'siteLanguages.label'),
      ...leaves(langContent.resume.profile.jobTitle, 'profile.jobTitle'),
      ...leaves(langContent.resume.profile.links.map(({ label }) => label), 'links.label'),
      ...leaves(langContent.resume.about, 'about'),
      ...leaves(langContent.resume.educations.map(({ title }) => title), 'educations.title'),
      ...leaves(langContent.resume.experiences.map(({ title }) => title), 'experiences.title'),
      ...leaves(
        langContent.resume.experiences.map(({ description }) => description),
        'experiences.description',
      ),
      ...leaves(langContent.resume.spokenLanguages.map(({ name }) => name), 'spokenLanguages'),
    ]
    const frenchByPath = new Map(translatable(fr).map(({ path, value }) => [path, value]))
    const untranslated = translatable(en)
      .filter(({ path, value }) => frenchByPath.get(path) === value)
      .map(({ path }) => path)

    expect(untranslated).toEqual([])
  })

  it('translates the multi-word skill names', () => {
    const frenchNames = fr.resume.skills.map(({ name }) => name)

    expect(frenchNames).toContain('Architecture hexagonale')
    expect(frenchNames).toContain('Architecture web')
  })

  it('lists the same skills, spoken languages and links in both languages', () => {
    expect(fr.resume.skills.map(({ rating }) => rating)).toEqual(
      en.resume.skills.map(({ rating }) => rating),
    )
    expect(fr.resume.spokenLanguages).toHaveLength(en.resume.spokenLanguages.length)
    expect(fr.resume.profile.links.map(({ kind }) => kind)).toEqual(
      en.resume.profile.links.map(({ kind }) => kind),
    )
  })

  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('uses UTC month starts and ordered dates in %s', (_lang, langContent) => {
    langContent.resume.experiences.forEach(({ start, end }) => {
      expect(isUtcMonthStart(start)).toBe(true)
      if (end !== null && end !== undefined) {
        expect(isUtcMonthStart(end)).toBe(true)
        expect(end.getTime()).toBeGreaterThanOrEqual(start.getTime())
      }
    })
  })

  it('has exactly one current position', () => {
    expect(en.resume.experiences.filter(({ end }) => end === null)).toHaveLength(1)
  })

  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('keeps ratings in range in %s', (_lang, langContent) => {
    langContent.resume.skills.forEach(({ rating }) => {
      expect(rating).toBeGreaterThanOrEqual(0)
      expect(rating).toBeLessThanOrEqual(100)
    })
    langContent.resume.spokenLanguages.forEach(({ rating }) => {
      expect(rating).toBeGreaterThanOrEqual(0)
      expect(rating).toBeLessThanOrEqual(1)
    })
  })

  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('offers every site language in %s', (_lang, langContent) => {
    expect(langContent.siteLanguages.map(({ code }) => code).toSorted()).toEqual(['EN', 'FR'])
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `bunx vitest run tests/server/content`
Expected: FAIL — cannot resolve `@/server/content`.

- [ ] **Step 4: Write the language-neutral content**

`src/server/content/shared.ts`:

```ts
import type { LinkKind } from '@/server/gql/types'

// UTC month start: no timezone can shift the date into the previous month
const month = (year: number, monthNumber: number): Date =>
  new Date(Date.UTC(year, monthNumber - 1, 1))

export const person = {
  name: 'Hugo Cantacuzene',
  location: 'Schoelcher, Martinique',
  email: 'h.cantacuzene@gmail.com',
} as const

export const linkUrls: Readonly<Record<LinkKind, string>> = {
  GITHUB: 'https://github.com/cantacuzene',
  LINKEDIN: 'https://www.linkedin.com/in/hugo-cantacuzene-903b9394',
  BADGES: 'https://backpack.openbadges.org/share/cc71ca2cf7aaf763192d151a1591309f/',
}

export const spokenLanguageRatings = { english: 0.87, french: 1 } as const

export const educationFacts = {
  master: { id: '1', year: 2008, school: 'EPITECH', location: 'Paris, France' },
  bachelor: { id: '0', year: 2006, school: 'EPITECH', location: 'Paris, France' },
} as const

export const experienceFacts = {
  karibIt: {
    id: '5',
    company: 'Karib IT SAS',
    start: month(2018, 1),
    end: null,
    stack: ['.NET Core', 'Python', 'Django', 'VS Code', 'heroku', 'CI/CD', 'git', 'DDD', 'TDD',
      'React', 'webpack', 'babel'],
  },
  zags: {
    id: '4',
    company: 'Zags!',
    start: month(2015, 4),
    end: month(2017, 5),
    stack: ['Asp.NET Mvc 4', '.NET 4.5.2', 'WCF', 'Visual studio 2015', 'Roslyn', 'VSTS', 'Moq',
      'Xunit', 'TDD/DDD', 'OAuth 2.0', 'Azure', 'JS', 'React', 'Scrum', '.NET Core', 'VS Code',
      'VS 2017', 'docker', 'CI/CD', 'TFS', 'git', 'webpack', 'babel'],
  },
  mgen: {
    id: '3',
    company: 'MGEN',
    start: month(2014, 7),
    end: month(2015, 3),
    stack: ['Oracle Sql Developer', 'Linqpad', 'Linq', 'c# 4.0', 'php 5', 'Oracle 10g', 'Qualiac'],
  },
  natixis: {
    id: '2',
    company: 'Natixis Asset Management',
    start: month(2010, 4),
    end: month(2014, 7),
    stack: ['Visual Studio 2010', 'SQL Server', 'RedGate Ants', 'TDD', 'Teamcity', 'FXcop', 'SVN',
      'Resharper', 'Nunit', 'MsTest', 'WCF', 'Javascript', 'IIS', '.NET 4', 'Linq', 'ASP.Net',
      'MVC', 'JQuery', 'C#', 'EF'],
  },
  itsGroup: {
    id: '1',
    company: 'ITS Group',
    start: month(2007, 12),
    end: month(2010, 4),
    stack: ['php 5.x', 'SQL server 2000', 'Asp', 'Apache 2', 'MySQL 5.x', 'LAMP Gupta 3.1',
      'Asp .NET 1.1.4', 'Workflow fundation', '.NET 3.5', 'Linq to SQL'],
  },
  rfo: {
    id: '0',
    company: 'France Télévision (R.F.O.)',
    start: month(2006, 5),
    end: month(2006, 10),
    stack: ['.NET 2.0', 'Traffic', 'Oracle', 'Active Directory', 'Windows server 2003'],
  },
} as const
```

(Stacks come from `data/en/Experiences.json`, split on commas, trimmed, exact duplicates removed.
Prettier reflows the arrays in Step 8.)

- [ ] **Step 5: Write the English content**

`src/server/content/en.ts`. Prose fields are copied **verbatim** from the named JSON file (the
files are still on disk at this point):
- `about.cover`: every `cover[].value` of `data/en/About.json`, in `id` order (7 strings).
- `about.interests`: every `interests[].value` of `data/en/About.json`, in `id` order (7 strings).
- each experience `description`: the `description` of the entry with the same `id` in
  `data/en/Experiences.json`.

```ts
import type { LangContent } from '@/server/content'
import {
  educationFacts,
  experienceFacts,
  linkUrls,
  person,
  spokenLanguageRatings,
} from '@/server/content/shared'

export const en = {
  resume: {
    profile: {
      ...person,
      jobTitle: 'Software Architect',
      links: [
        { kind: 'GITHUB', url: linkUrls.GITHUB, label: 'My GitHub profile' },
        { kind: 'LINKEDIN', url: linkUrls.LINKEDIN, label: 'My LinkedIn profile' },
        { kind: 'BADGES', url: linkUrls.BADGES, label: 'View my badges' },
      ],
    },
    about: {
      cover: [
        // data/en/About.json cover[0..6].value, verbatim
      ],
      interests: [
        // data/en/About.json interests[0..6].value, verbatim
      ],
    },
    skills: [
      { name: 'C#', rating: 90 },
      { name: 'HTML', rating: 80 },
      { name: 'CSS', rating: 70 },
      { name: 'JS', rating: 80 },
      { name: 'Docker', rating: 60 },
      { name: 'SQL', rating: 70 },
      { name: 'Linux', rating: 60 },
      { name: 'dotnet core', rating: 60 },
      { name: 'Hexagonal Architecture', rating: 70 },
      { name: 'React', rating: 70 },
      { name: 'Go', rating: 30 },
      { name: 'Ruby', rating: 30 },
      { name: 'Scrum Master', rating: 90 },
      { name: 'Web Architecture', rating: 90 },
    ],
    educations: [
      { ...educationFacts.master, title: 'Master: Expert in Information Technologies' },
      { ...educationFacts.bachelor, title: 'Bachelor in Information Technologies' },
    ],
    experiences: [
      { ...experienceFacts.karibIt, title: 'Software Architect', description: '…id 5…' },
      { ...experienceFacts.zags, title: 'Software Architect', description: '…id 4…' },
      { ...experienceFacts.mgen, title: 'Product Owner', description: '…id 3…' },
      { ...experienceFacts.natixis, title: 'Lead Software Engineer', description: '…id 2…' },
      { ...experienceFacts.itsGroup, title: 'Software Engineer', description: '…id 1…' },
      { ...experienceFacts.rfo, title: 'Intern', description: '…id 0…' },
    ],
    spokenLanguages: [
      { name: 'English', rating: spokenLanguageRatings.english },
      { name: 'French', rating: spokenLanguageRatings.french },
    ],
  },
  translations: {
    sections: {
      about: 'About',
      skills: 'Skills',
      education: 'Education',
      languages: 'Languages',
      experiences: 'Experience',
    },
    header: { switchTo: 'Switch to:', emailMe: 'Email me!' },
    timeline: { present: 'Present' },
    aria: { switchLanguage: 'Switch language', retry: 'Retry', loading: 'Loading' },
  },
  siteLanguages: [
    { code: 'FR', label: 'French' },
    { code: 'EN', label: 'English' },
  ],
} satisfies LangContent
```

The `// …verbatim` comments and `'…id N…'` markers stand for the copied strings: the committed
file contains the real strings and none of these markers.

- [ ] **Step 6: Write the French content**

`src/server/content/fr.ts`, same shape. Copy verbatim from `data/fr/About.json` (cover: 8
strings, interests: 7 strings) and each `description` from `data/fr/Experiences.json` by `id`.
Every other French string is written below; none stays in English. If a copied description or
paragraph from `data/fr/` is itself in English, translate it and say so in the report (the
"translates every translatable string" test fails otherwise).

```ts
import type { LangContent } from '@/server/content'
import {
  educationFacts,
  experienceFacts,
  linkUrls,
  person,
  spokenLanguageRatings,
} from '@/server/content/shared'

export const fr = {
  resume: {
    profile: {
      ...person,
      jobTitle: 'Architecte logiciel',
      links: [
        { kind: 'GITHUB', url: linkUrls.GITHUB, label: 'Mon profil GitHub' },
        { kind: 'LINKEDIN', url: linkUrls.LINKEDIN, label: 'Mon profil LinkedIn' },
        { kind: 'BADGES', url: linkUrls.BADGES, label: 'Voir mes badges' },
      ],
    },
    about: {
      cover: [
        // data/fr/About.json cover[0..7].value, verbatim
      ],
      interests: [
        // data/fr/About.json interests[0..6].value, verbatim
      ],
    },
    skills: [
      { name: 'C#', rating: 90 },
      { name: 'HTML', rating: 80 },
      { name: 'CSS', rating: 70 },
      { name: 'JS', rating: 80 },
      { name: 'Docker', rating: 60 },
      { name: 'SQL', rating: 70 },
      { name: 'Linux', rating: 60 },
      { name: 'dotnet core', rating: 60 },
      { name: 'Architecture hexagonale', rating: 70 },
      { name: 'React', rating: 70 },
      { name: 'Go', rating: 30 },
      { name: 'Ruby', rating: 30 },
      { name: 'Scrum Master', rating: 90 },
      { name: 'Architecture web', rating: 90 },
    ],
    educations: [
      { ...educationFacts.master, title: "Master Expert en Technologies de l'Information" },
      { ...educationFacts.bachelor, title: "Bachelor en Technologies de l'Information" },
    ],
    experiences: [
      { ...experienceFacts.karibIt, title: 'Architecte logiciel', description: '…id 5…' },
      { ...experienceFacts.zags, title: 'Architecte logiciel', description: '…id 4…' },
      { ...experienceFacts.mgen, title: 'Product Owner (responsable produit)', description: '…id 3…' },
      { ...experienceFacts.natixis, title: 'Lead développeur', description: '…id 2…' },
      { ...experienceFacts.itsGroup, title: 'Ingénieur logiciel', description: '…id 1…' },
      { ...experienceFacts.rfo, title: 'Stagiaire', description: '…id 0…' },
    ],
    spokenLanguages: [
      { name: 'Anglais', rating: spokenLanguageRatings.english },
      { name: 'Français', rating: spokenLanguageRatings.french },
    ],
  },
  translations: {
    sections: {
      about: 'À propos',
      skills: 'Compétences',
      education: 'Formation',
      languages: 'Langues',
      experiences: 'Expérience',
    },
    header: { switchTo: 'Changer de langue :', emailMe: 'Écrivez-moi !' },
    timeline: { present: "Aujourd'hui" },
    aria: { switchLanguage: 'Changer de langue', retry: 'Réessayer', loading: 'Chargement' },
  },
  siteLanguages: [
    { code: 'FR', label: 'Français' },
    { code: 'EN', label: 'Anglais' },
  ],
} satisfies LangContent
```

- [ ] **Step 7: Write the index**

`src/server/content/index.ts`:

```ts
import { en } from '@/server/content/en'
import { fr } from '@/server/content/fr'
import type { Lang, Resume, SiteLanguage, Translations } from '@/server/gql/types'

export type LangContent = Readonly<{
  resume: Resume
  translations: Translations
  siteLanguages: ReadonlyArray<SiteLanguage>
}>

// A Lang added to the schema without content fails `typecheck` here
export const content: Readonly<Record<Lang, LangContent>> = { FR: fr, EN: en }
```

- [ ] **Step 8: Run the tests and typecheck**

Run: `bunx vitest run tests/server/content` — Expected: all tests PASS.
Run: `bun run typecheck` — Expected: exit 0.
Run: `bun run format` — reflows the new files.

- [ ] **Step 9: Delete the legacy data**

```bash
git rm -rq data
```

Remove the `data/` line from `.prettierignore`.

Run: `grep -rn "data/" src tests scripts` — Expected: no match (no code reads `data/`; the
`// data/…` transcription comments from Steps 5–6 must be gone).

- [ ] **Step 10: Verify and commit**

Run: `bun run verify` — Expected: exit 0.

```bash
git add -A -- src/server/content tests/server/content data .prettierignore
git commit -m "feat: move resume content and UI strings into typed modules

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Server configuration

**Files:**
- Create: `src/server/config.utils.ts`, `tests/server/config.utils.test.ts`

**Interfaces:**
- Consumes: `ok`, `err`, `Result` from `@/shared/result` (Task 2)
- Produces:
  - `export type Config = Readonly<{ port: number; corsOrigins: ReadonlyArray<string>; graphiql: boolean }>`
  - `export const parseConfig: (env: Readonly<Record<string, string | undefined>>) => Result<Config, string>`

- [ ] **Step 1: Create the branch**

```bash
git checkout -b backend/5-config
```

- [ ] **Step 2: Write the failing tests**

`tests/server/config.utils.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { parseConfig } from '@/server/config.utils'

describe('parseConfig', () => {
  it('applies the defaults', () => {
    expect(parseConfig({})).toEqual({
      ok: true,
      value: { port: 4000, corsOrigins: ['http://localhost:5173'], graphiql: true },
    })
  })

  it('reads a valid PORT', () => {
    expect(parseConfig({ PORT: '8080' })).toMatchObject({ ok: true, value: { port: 8080 } })
  })

  it.each(['abc', '0', '65536', '80.5', '-1', ''])('rejects PORT=%j', (port) => {
    expect(parseConfig({ PORT: port })).toEqual({
      ok: false,
      error: `PORT must be an integer between 1 and 65535, got "${port}"`,
    })
  })

  it('reads and trims CORS_ORIGINS', () => {
    expect(
      parseConfig({ CORS_ORIGINS: ' https://cantacuzene.github.io , http://localhost:4173/ ' }),
    ).toMatchObject({
      ok: true,
      value: { corsOrigins: ['https://cantacuzene.github.io', 'http://localhost:4173'] },
    })
  })

  it('rejects an empty CORS_ORIGINS entry', () => {
    expect(parseConfig({ CORS_ORIGINS: 'https://a.example,,https://b.example' })).toEqual({
      ok: false,
      error: 'CORS_ORIGINS contains an empty entry',
    })
  })

  it('rejects a CORS_ORIGINS entry that is not a URL', () => {
    expect(parseConfig({ CORS_ORIGINS: 'not a url' })).toEqual({
      ok: false,
      error: 'CORS_ORIGINS entry "not a url" is not an http(s) URL',
    })
  })

  it('rejects a CORS_ORIGINS entry with another scheme', () => {
    expect(parseConfig({ CORS_ORIGINS: 'ftp://files.example' })).toEqual({
      ok: false,
      error: 'CORS_ORIGINS entry "ftp://files.example" is not an http(s) URL',
    })
  })

  it('disables GraphiQL in production', () => {
    expect(parseConfig({ NODE_ENV: 'production' })).toMatchObject({
      ok: true,
      value: { graphiql: false },
    })
  })

  it('reports the PORT error before CORS_ORIGINS errors', () => {
    expect(parseConfig({ PORT: 'x', CORS_ORIGINS: 'not a url' })).toMatchObject({
      ok: false,
      error: expect.stringContaining('PORT') as unknown,
    })
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `bunx vitest run tests/server/config.utils.test.ts`
Expected: FAIL — cannot resolve `@/server/config.utils`.

- [ ] **Step 4: Implement**

`src/server/config.utils.ts`:

```ts
import { err, ok, type Result } from '@/shared/result'

export type Config = Readonly<{
  port: number
  corsOrigins: ReadonlyArray<string>
  graphiql: boolean
}>

type Env = Readonly<Record<string, string | undefined>>

const DEFAULT_PORT = 4000
// The Vite dev server
const DEFAULT_CORS_ORIGINS: ReadonlyArray<string> = ['http://localhost:5173']

const parsePort = (raw: string | undefined): Result<number, string> => {
  if (raw === undefined) {
    return ok(DEFAULT_PORT)
  }
  const port = Number(raw)
  return /^\d+$/.test(raw) && port >= 1 && port <= 65_535
    ? ok(port)
    : err(`PORT must be an integer between 1 and 65535, got "${raw}"`)
}

const isHttpUrl = (value: string): boolean =>
  URL.canParse(value) && ['http:', 'https:'].includes(new URL(value).protocol)

const parseOrigin = (entry: string): Result<string, string> => {
  const origin = entry.trim()
  if (origin === '') {
    return err('CORS_ORIGINS contains an empty entry')
  }
  return isHttpUrl(origin)
    ? ok(new URL(origin).origin)
    : err(`CORS_ORIGINS entry "${origin}" is not an http(s) URL`)
}

const parseCorsOrigins = (raw: string | undefined): Result<ReadonlyArray<string>, string> => {
  if (raw === undefined) {
    return ok(DEFAULT_CORS_ORIGINS)
  }
  const origins = raw.split(',').map(parseOrigin)
  const failure = origins.find((origin) => !origin.ok)
  if (failure !== undefined && !failure.ok) {
    return err(failure.error)
  }
  return ok(origins.flatMap((origin) => (origin.ok ? [origin.value] : [])))
}

export const parseConfig = (env: Env): Result<Config, string> => {
  const port = parsePort(env.PORT)
  if (!port.ok) {
    return port
  }
  const corsOrigins = parseCorsOrigins(env.CORS_ORIGINS)
  if (!corsOrigins.ok) {
    return corsOrigins
  }
  return ok({
    port: port.value,
    corsOrigins: corsOrigins.value,
    graphiql: env.NODE_ENV !== 'production',
  })
}
```

- [ ] **Step 5: Run the tests**

Run: `bunx vitest run tests/server/config.utils.test.ts`
Expected: all tests PASS.

- [ ] **Step 6: Verify and commit**

Run: `bun run verify` — Expected: exit 0, coverage ≥ 90%.

```bash
git add src/server/config.utils.ts tests/server/config.utils.test.ts
git commit -m "feat: parse server configuration from the environment

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Resolvers, Yoga server and Bun entry point

**Files:**
- Create: `src/server/resolvers.ts`, `src/server/yoga.ts`, `src/server/main.ts`,
  `tests/server/resolvers.test.ts`, `tests/server/yoga.test.ts`
- Modify: `package.json` (deps, `dev:server`, `start`), `tsconfig.json` (`types`)

**Interfaces:**
- Consumes: `typeDefs` (Task 3), `Resolvers` (Task 3), `content` (Task 4), `Config` and
  `parseConfig` (Task 5)
- Produces:
  - `export const resolvers: Resolvers`
  - `export const createServer: (config: Readonly<Pick<Config, 'corsOrigins' | 'graphiql'>>) => YogaServerInstance<…>`
  - scripts `dev:server`, `start`

- [ ] **Step 1: Create the branch and install dependencies**

```bash
git checkout -b backend/6-graphql-server
bun add graphql-yoga @graphql-tools/schema
bun add -d @types/bun
```

In `tsconfig.json`, change `types` to `["vite/client", "node", "bun"]`.

In `package.json` scripts, add:

```json
"dev:server": "bun --watch src/server/main.ts",
"start": "bun src/server/main.ts",
```

- [ ] **Step 2: Write the failing resolvers test**

`tests/server/resolvers.test.ts`:

```ts
// @vitest-environment node
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql'
import { describe, expect, it } from 'vitest'
import { content } from '@/server/content'
import { resolvers } from '@/server/resolvers'
import { typeDefs } from '@/server/typeDefs'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const run = (source: string, lang: string) =>
  graphql({ schema, source, variableValues: { lang } })

describe('resolvers', () => {
  it.each(['FR', 'EN'] as const)('returns the %s section titles', async (lang) => {
    const result = await run(
      'query ($lang: Lang!) { translations(lang: $lang) { sections { about } } }',
      lang,
    )

    expect(result).toEqual({
      data: { translations: { sections: { about: content[lang].translations.sections.about } } },
    })
  })

  it('returns the requested language profile', async () => {
    const result = await run(
      'query ($lang: Lang!) { resume(lang: $lang) { profile { jobTitle } } }',
      'FR',
    )

    expect(result).toEqual({
      data: { resume: { profile: { jobTitle: content.FR.resume.profile.jobTitle } } },
    })
  })

  it('returns the site languages labelled in the requested language', async () => {
    const result = await run(
      'query ($lang: Lang!) { siteLanguages(lang: $lang) { code label } }',
      'EN',
    )

    expect(result).toEqual({ data: { siteLanguages: content.EN.siteLanguages } })
  })

  it('serializes dates as ISO date strings', async () => {
    const result = await run(
      'query ($lang: Lang!) { resume(lang: $lang) { experiences { id start end } } }',
      'EN',
    )

    expect(result.data?.resume).toMatchObject({
      experiences: expect.arrayContaining([{ id: '5', start: '2018-01-01', end: null }]) as unknown,
    })
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `bunx vitest run tests/server/resolvers.test.ts`
Expected: FAIL — cannot resolve `@/server/resolvers`.

- [ ] **Step 4: Implement the resolvers**

`src/server/resolvers.ts`:

```ts
import { DateResolver } from 'graphql-scalars'
import { content } from '@/server/content'
import type { Resolvers } from '@/server/gql/types'

// Pure: static content, no I/O (docs/guidelines/backend.md)
export const resolvers: Resolvers = {
  Date: DateResolver,
  Query: {
    resume: (_parent, { lang }) => content[lang].resume,
    translations: (_parent, { lang }) => content[lang].translations,
    siteLanguages: (_parent, { lang }) => content[lang].siteLanguages,
  },
}
```

Run: `bunx vitest run tests/server/resolvers.test.ts` — Expected: 5 tests PASS.

- [ ] **Step 5: Write the failing server test**

`tests/server/yoga.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createServer } from '@/server/yoga'

const ALLOWED_ORIGIN = 'http://localhost:5173'
const RESUME_PAGE = `
  query ResumePage($lang: Lang!) {
    resume(lang: $lang) {
      profile { name }
      experiences { id start end }
    }
    translations(lang: $lang) { sections { about } }
    siteLanguages(lang: $lang) { code label }
  }
`

const yoga = createServer({ corsOrigins: [ALLOWED_ORIGIN], graphiql: false })

const post = (body: unknown): Promise<Response> =>
  Promise.resolve(
    yoga.fetch('http://localhost/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )

const preflight = (origin: string): Promise<Response> =>
  Promise.resolve(
    yoga.fetch('http://localhost/graphql', {
      method: 'OPTIONS',
      headers: { origin, 'access-control-request-method': 'POST' },
    }),
  )

describe('createServer', () => {
  it('answers the ResumePage query in French', async () => {
    const response = await post({ query: RESUME_PAGE, variables: { lang: 'FR' } })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      data: {
        resume: {
          profile: { name: 'Hugo Cantacuzene' },
          experiences: expect.arrayContaining([
            { id: '5', start: '2018-01-01', end: null },
          ]) as unknown,
        },
        translations: { sections: { about: 'À propos' } },
      },
    })
  })

  it('answers the ResumePage query in English', async () => {
    const response = await post({ query: RESUME_PAGE, variables: { lang: 'EN' } })

    expect(await response.json()).toMatchObject({
      data: { translations: { sections: { about: 'About' } } },
    })
  })

  it('rejects an unknown language', async () => {
    const response = await post({ query: RESUME_PAGE, variables: { lang: 'DE' } })
    const body = (await response.json()) as { errors?: ReadonlyArray<unknown> }

    expect(body.errors).toHaveLength(1)
  })

  it('returns 404 outside /graphql', async () => {
    const response = await yoga.fetch('http://localhost/api/en/Skills')

    expect(response.status).toBe(404)
  })

  it('allows CORS for configured origins', async () => {
    const response = await preflight(ALLOWED_ORIGIN)

    expect(response.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('does not allow CORS for other origins', async () => {
    const response = await preflight('https://evil.example')

    expect(response.headers.get('access-control-allow-origin')).not.toBe('https://evil.example')
  })

  it('serves GraphiQL only when enabled', async () => {
    const withGraphiql = createServer({ corsOrigins: [ALLOWED_ORIGIN], graphiql: true })
    const request = { headers: { accept: 'text/html' } }

    const enabled = await withGraphiql.fetch('http://localhost/graphql', request)
    const disabled = await yoga.fetch('http://localhost/graphql', request)

    expect(enabled.headers.get('content-type')).toContain('text/html')
    expect(disabled.headers.get('content-type') ?? '').not.toContain('text/html')
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `bunx vitest run tests/server/yoga.test.ts`
Expected: FAIL — cannot resolve `@/server/yoga`.

- [ ] **Step 7: Implement the server and the entry point**

`src/server/yoga.ts`:

```ts
import { makeExecutableSchema } from '@graphql-tools/schema'
import { createYoga } from 'graphql-yoga'
import type { Config } from '@/server/config.utils'
import { resolvers } from '@/server/resolvers'
import { typeDefs } from '@/server/typeDefs'

const schema = makeExecutableSchema({ typeDefs, resolvers })

// Error masking stays on (Yoga's default): unexpected errors reach clients as "Unexpected error."
export const createServer = (config: Readonly<Pick<Config, 'corsOrigins' | 'graphiql'>>) =>
  createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    graphiql: config.graphiql,
    landingPage: false,
    cors: { origin: [...config.corsOrigins], methods: ['POST'] },
  })
```

`src/server/main.ts`:

```ts
import { parseConfig } from '@/server/config.utils'
import { createServer } from '@/server/yoga'

// The only side-effecting server module: reads the environment and binds the port
const config = parseConfig(process.env)

if (!config.ok) {
  console.error(`Invalid configuration: ${config.error}`)
  process.exit(1)
}

const server = Bun.serve({ port: config.value.port, fetch: createServer(config.value) })

console.log(`GraphQL API listening on ${new URL('/graphql', server.url).href}`)
```

- [ ] **Step 8: Run the server tests**

Run: `bunx vitest run tests/server`
Expected: all tests PASS. If a CORS or GraphiQL assertion fails because of how the installed
Yoga version shapes headers, print the actual response headers, keep the behaviour under test
(allowed origin echoed; other origins not echoed; HTML only with GraphiQL on), and record the
adaptation in the report.

- [ ] **Step 9: Smoke-test the real server**

```bash
PORT=4123 bun src/server/main.ts &
SERVER=$!
sleep 1
curl -s -X POST http://localhost:4123/graphql -H 'content-type: application/json' \
  -d '{"query":"{ translations(lang: EN) { sections { about } } }"}'
kill $SERVER
```

Expected: `{"data":{"translations":{"sections":{"about":"About"}}}}`.

```bash
PORT=abc bun src/server/main.ts; echo "exit $?"
```

Expected: `Invalid configuration: PORT must be an integer between 1 and 65535, got "abc"` and
`exit 1`.

- [ ] **Step 10: Verify and commit**

Run: `bun run verify` — Expected: exit 0.

```bash
git add src/server tests/server package.json bun.lock tsconfig.json
git commit -m "feat: serve the resume over GraphQL Yoga on Bun

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Guidelines and project docs

**Files:**
- Modify: `docs/guidelines/backend.md`, `docs/guidelines/common.md`,
  `docs/guidelines/frontend.md`, `docs/superpowers/specs/2026-09-21-react-guidelines-design.md`,
  `CLAUDE.md`

**Interfaces:**
- Consumes: everything above
- Produces: guidelines that match the code

- [ ] **Step 1: Create the branch**

```bash
git checkout -b backend/7-guidelines
```

- [ ] **Step 2: Rewrite `docs/guidelines/backend.md`**

```markdown
# Backend Guidelines (Bun + GraphQL)

These rules apply to the backend (`src/server/`), **in addition to** [`common.md`](common.md).

## 1. Runtime & API

- Runtime: **Bun**, TypeScript executed natively.
- The backend exposes a **single GraphQL endpoint**, `POST /graphql`, built with GraphQL Yoga. No
  REST routes.
- The SDL file `src/server/schema.graphql` is the source of truth. Types are generated from it
  into `src/server/gql/`; generated code is committed and never edited by hand.
- **Translations are served by the backend**: resume content and all UI strings. Every
  translation field in the schema is non-nullable (`String!`).
- No React, client code or browser APIs in `src/server/`.
- Dates are `Date` values, sent as the ISO `Date` scalar (`graphql-scalars`). Formatting belongs
  to the frontend **(review)**.

## 2. Structure

- **Content** is typed TypeScript in `src/server/content/`, checked with `satisfies` against the
  generated types. Language-neutral values live once in `content/shared.ts`.
- **Resolvers are pure**: they read content and never perform I/O **(review)**.
- **Configuration** is read only in `src/server/main.ts`, through
  `parseConfig(process.env)`; invalid configuration stops the process before it binds a port
  **(review)**.
- `src/server/main.ts` is the only side-effecting module; everything it wires is testable
  without a port (`yoga.fetch`).
- Error masking stays enabled; GraphiQL is disabled in production.

## 3. Testing

- Tests run with **Vitest** in the node environment (`// @vitest-environment node`), under the
  package's shared coverage gate.
- Every `src/server/**/*.ts` module has a mirrored test, except the entry point, generated code
  and the content data files.
- The GraphQL server is tested through real requests (`yoga.fetch`), not by calling resolvers
  with hand-built arguments.
- Translation completeness is tested: every string is non-empty in every supported language.

## 4. Enforcement

In addition to the [common enforcement](common.md#5-enforcement):

| Rule | Tool |
|---|---|
| No React, client code or browser APIs on the server | `no-restricted-imports`, `no-restricted-globals` scoped to `src/server/**` |
| Content matches the schema, every language present | `tsc --noEmit` (`satisfies`, `Record<Lang, …>`) |
| Generated types up to date | `check:gql` (regenerate + `git diff --exit-code`) |
| Translations complete and non-empty | `tests/server/content/index.test.ts` |
| Error masking on, GraphiQL off in production, CORS restricted | `tests/server/yoga.test.ts` |
| Every server module has a test | `scripts/check-tests.ts` |
| Coverage ≥ 90% | Vitest `coverage.thresholds` |
```

- [ ] **Step 3: Update `docs/guidelines/common.md`**

- In §2, change the `Result` bullet to:
  `- **Errors are values.** I/O layers return a \`Result<T, E>\` union (\`src/shared/result.ts\`) and never throw.`
- In §3, add a bullet:
  `- \`src/shared/\` is runtime-neutral: no React, DOM, Bun or Node APIs, and no imports from \`src/client/\` or \`src/server/\`.`
- In the §5 table, add the row:
  `| \`src/shared/\` is runtime-neutral | \`no-restricted-imports\`, \`no-restricted-globals\` scoped to \`src/shared/**\` |`

- [ ] **Step 4: Update `docs/guidelines/frontend.md`**

- First line after the title: state that the rules apply to `src/client/`.
- §2: `src/api/` → `src/client/api/`.
- §4: `src/**/*.tsx` → `src/client/**/*.tsx`, `src/**/*.utils.ts` → `src/client/**/*.utils.ts`.
- §5 table: `` `fetch` only in `src/client/api/` `` and `disabled for \`src/client/api/**\``.

- [ ] **Step 5: Point the frontend design at this backend**

In `docs/superpowers/specs/2026-09-21-react-guidelines-design.md`:
- Under the `## 2. Backend contract consumed by the frontend` heading, add:
  `> The full schema is defined in [the backend design](2026-09-21-backend-graphql-design.md#3-schema); it supersedes the sketch below.`
- In §5's target layout, prefix the frontend folders with `client/` (`src/client/api/`,
  `src/client/components/`, …, `src/client/gql/`) and the matching `tests/client/…` folders, and
  add `src/server/` and `src/shared/` with a pointer to the backend design.

- [ ] **Step 6: Update `CLAUDE.md`**

Replace the Commands section with:

```markdown
## Commands

- `bun run verify`: every check; runs on pre-commit and in CI, and must pass
- `bun run dev`: start Vite (frontend)
- `bun run dev:server`: start the GraphQL API with reload (`http://localhost:4000/graphql`)
- `bun run start`: start the GraphQL API
- `bun run codegen`: regenerate `src/server/gql/` after editing `src/server/schema.graphql`
- `bun run test`: Vitest with coverage
- The pre-commit hook (Lefthook) runs `verify` on the whole working tree, not just staged files:
  stash or commit unrelated work in progress before committing.
- `bun` must be on `PATH` for the pre-commit hook to run, including when committing from a GUI git
  client.

## Server environment

- `PORT`: API port, default `4000`
- `CORS_ORIGINS`: comma-separated allowed origins, default `http://localhost:5173`
- `NODE_ENV=production`: disables GraphiQL
```

- [ ] **Step 7: Verify and commit**

Run: `bun run verify` — Expected: exit 0.

```bash
git add docs CLAUDE.md
git commit -m "docs: complete the backend guidelines and point docs at src/client

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```
