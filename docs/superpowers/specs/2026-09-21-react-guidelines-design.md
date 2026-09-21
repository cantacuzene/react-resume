# React Guidelines — Implementation Design

- **Date:** 2026-09-21
- **Status:** Draft — awaiting review
- **Guidelines:** [`common.md`](../../guidelines/common.md) and
  [`frontend.md`](../../guidelines/frontend.md) — the generic rules
  ([`backend.md`](../../guidelines/backend.md) is completed in sub-project 3). This document only
  describes how this repository applies and enforces them on the frontend.
- **Scope:** sub-project 1 of 3 of the stack migration
  1. **Guidelines + enforcement tooling** ← this spec
  2. Frontend migration to Vite + TypeScript (separate spec)
  3. Backend migration to Bun + TypeScript + GraphQL (separate spec)

## 1. Context

The repo is a 2018 React 16 resume app: webpack 4, Babel 7 betas, Redux + redux-thunk + a custom
Fluture middleware, Ramda with the Babel pipeline operator (`|>`), Enzyme tests on Jest 22, and a
40-line Express server serving `data/{lang}/*.json` under `/api/:lang/*`. `Header.js` contains
untranslated hard-coded strings. `appveyor.yml` is leftover react-slingshot boilerplate.

### Decisions taken during brainstorming

| Topic | Decision |
|---|---|
| State management | Redux, sagas, thunks, Fluture and the custom middleware are removed |
| Language switch | React context |
| Data fetching | Hand-written hook, no TanStack Query / GraphQL client library |
| API | One GraphQL endpoint replaces all REST routes |
| Translations | Served by the backend (resume content **and** UI strings) |
| Functional style | Ramda kept, `\|>` replaced by `pipe()` |
| Tests | React Testing Library, in `tests/` outside `src/` |
| Enforcement | ESLint + Prettier, 90% coverage, Lefthook pre-commit running full `verify`, GitHub Actions |

## 2. Backend contract consumed by the frontend

`POST /graphql` (GraphQL Yoga on `Bun.serve`, detailed in the backend spec) replaces the six
`/api/:lang/*` routes, including `/api/:lang/Titles`.

```graphql
enum Lang { FR EN }

type Query {
  resume(lang: Lang!): Resume!
  translations(lang: Lang!): Translations!
  siteLanguages(lang: Lang!): [SiteLanguage!]!   # code + label in the current language
}
```

- `Translations` covers section titles (formerly `Titles.json`), header labels ("Switch to:",
  "Email me!", job title, …), aria-labels and switcher language names.
- Every translation field is `String!`; per-language completeness is tested on the backend.
- The frontend sends one document, `ResumePage($lang)`, selecting all three fields: one round trip
  per language switch.
- GraphQL Code Generator (`client-preset`) generates typed documents and types (including `Lang`)
  into `src/gql/`. Generated code is committed and excluded from lint and coverage. The schema
  source path is defined in the backend spec.

## 3. State inventory

Per frontend guidelines §2, the only stateful units are:

| Unit | Kind | State |
|---|---|---|
| `LanguageProvider` | context provider | current `Lang` (default `FR`) |
| `useResumePage` | data hook | request status union |

### 3.1 `LanguageContext`

```ts
type LanguageContextValue = Readonly<{
  lang: Lang
  setLang: (lang: Lang) => void
}>
```

- `<LanguageProvider initialLang={…}>` holds `useState<Lang>`, default `FR`.
- `useLanguage()` throws a descriptive error outside the provider.
- The provider syncs `document.documentElement.lang` in a `useEffect`.
- No persistence or browser-language detection.

### 3.2 `useResumePage(lang)`

Returns `{ status: 'loading' } | { status: 'error'; error: ApiError; retry: () => void } |
{ status: 'success'; data: ResumePageQuery }`. Aborts the in-flight request on `lang` change and
ignores stale responses.

### 3.3 API layer

- `src/api/result.ts` — `Result<T, E>` type and constructors.
- `src/api/graphql.ts` — `request<TData, TVars>(document, variables, signal):
  Promise<Result<TData, ApiError>>`. Network failures, non-2xx responses and GraphQL `errors`
  arrays all become `Err`. Never throws.

## 4. Data flow

```
LanguageProvider (lang)
  └─ App: const state = useResumePage(lang)
       ├─ loading → <Loading />            aria-busy spinner, no text
       ├─ error   → <LoadError retry />    icon + retry button
       └─ success → <Header t={data.translations.header} languages={data.siteLanguages} />
                    <HomePage resume={data.resume} t={data.translations.sections} />
```

- Only `App` uses `useResumePage`. Translations flow down as props (`t`).
- `Header` is the only component calling `useLanguage()` (for `setLang`). The switcher renders the
  other languages (`otherLanguages` in `src/i18n/languages.utils.ts`) as `<button>`s with
  translated `aria-label`s.
- **Documented exception to "no hard-coded text":** `LoadError` is shown precisely when
  translations failed to load, so it uses a local fallback `{ FR: 'Réessayer', EN: 'Retry' }` for
  its button's `aria-label`. `react/jsx-no-literals` is disabled for that file only.

## 5. Folder layout

```
src/
  main.tsx
  App.tsx
  api/          graphql.ts, result.ts
  components/   Header/Header.tsx, Header/Header.utils.ts, Skills/…, LoadError/…, Loading/…
  hooks/        useResumePage.ts
  i18n/         LanguageContext.tsx, languages.utils.ts
  gql/          (generated)
tests/
  api/          graphql.test.ts
  components/   Header.test.tsx, Header.utils.test.ts, …
  hooks/        useResumePage.test.tsx
  i18n/         LanguageContext.test.tsx, languages.utils.test.ts
  support/      setup.ts, renderWithProviders.tsx, fixtures.ts, handlers.ts
scripts/
  check-tests.ts
```

## 6. Test plan by unit

`tests/support/`:
- `setup.ts` — jest-dom matchers; MSW server with `onUnhandledRequest: 'error'`.
- `renderWithProviders(ui, { lang })` — wraps in `LanguageProvider`.
- `fixtures.ts` — FR/EN `ResumePage` responses typed with the generated query types.
- `handlers.ts` — default `graphql.query('ResumePage', …)` handlers returning the fixtures.

| Unit | Tests |
|---|---|
| Sections (`AboutMe`, `Education`, `Timeline`, …) | Plain `render` with fixture props: data rendered, titles from `t`, empty lists. |
| `Header` | `renderWithProviders`: only other languages shown as buttons; clicking switches language (`document.documentElement.lang`); labels from `t`. |
| `LanguageContext` | Default `FR`; `setLang` updates consumers; `initialLang` respected; `useLanguage()` throws outside provider. |
| `useResumePage` | loading→success; loading→error for network failure, HTTP 500, GraphQL `errors`; `retry` refetches; race FR→EN→FR with delayed responses, FR wins. |
| `api/graphql.ts` | Every failure path yields `Err`; never throws. |
| `*.utils.ts` | Input→output. |
| d3 `LanguageChart` | Rendered directly (SVG in JSX): language label, arcs present. |
| Highcharts `Skills` | `vi.mock` the Highcharts React wrapper with a stub exposing received `options`; option building covered by util tests. |

Coverage exclusions: `src/gql/**`, `src/main.tsx`. `check-tests.ts` exemptions: the same.

## 7. Tooling

Bun is the package manager and script runner.

### 7.1 Files

| File | Content |
|---|---|
| `tsconfig.json` | Common guidelines §1 compiler options; `@/*` → `src/*` path alias |
| `.prettierrc` | Common guidelines §5 Prettier options |
| `eslint.config.ts` | Flat config implementing the common §5 and frontend §5 tables; `tests/**` override for Testing Library rules; overrides for `src/api/**` (`fetch`), `LoadError` (`jsx-no-literals`), config files (default export); ignores `src/gql/**` |
| `vitest.config.ts` | jsdom, `tests/**/*.test.ts(x)`, setup file, `@/` alias, v8 coverage with thresholds and exclusions from §6 |
| `codegen.ts` | GraphQL Code Generator `client-preset` → `src/gql/` |
| `scripts/check-tests.ts` | Walks `src/`, maps `*.tsx` / `*.utils.ts` to `tests/**/*.test.ts(x)`, exits non-zero listing missing tests |
| `lefthook.yml` | pre-commit, sequential: 1) Prettier + `eslint --fix` on staged files with `stage_fixed: true`; 2) `bun run verify` |
| `.github/workflows/ci.yml` | push + PR: `oven-sh/setup-bun` → `bun install --frozen-lockfile` → `bun run verify` |
| `CLAUDE.md` | Links `docs/guidelines/common.md` (all code), `frontend.md` and `backend.md` as mandatory |

`appveyor.yml` is deleted. Husky is not used: Lefthook runs arbitrary commands, which covers the
pre-commit requirement.

### 7.2 Scripts

```jsonc
"lint":         "eslint . --max-warnings 0",
"format":       "prettier --write .",
"format:check": "prettier --check .",
"typecheck":    "tsc --noEmit",
"test":         "vitest run --coverage",
"codegen":      "graphql-codegen",
"check:tests":  "bun scripts/check-tests.ts",
"check:gql":    "bun run codegen && git diff --exit-code src/gql",
"verify":       "bun run format:check && bun run lint && bun run typecheck && bun run check:tests && bun run check:gql && bun run test"
```

## 8. Out of scope (later specs)

- Vite project setup, component-by-component migration, replacing the unmaintained
  `react-highcharts`, SCSS handling — frontend spec.
- GraphQL schema details, resolvers, translation data model, schema export for codegen,
  deployment (current Heroku `Procfile`) — backend spec.
- Repo layout (single package vs. Bun workspaces for web/api) — frontend spec, as it decides where
  the §7 files live.
