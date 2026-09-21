# Backend (Bun + GraphQL): Implementation Design

- **Date:** 2026-09-21
- **Status:** Draft, awaiting review
- **Guidelines:** [`common.md`](../../guidelines/common.md) and
  [`backend.md`](../../guidelines/backend.md), which this spec completes (§8)
- **Scope:** sub-project 3 of 3 of the stack migration, **done before sub-project 2**
  1. Guidelines + enforcement tooling ([spec](2026-09-21-react-guidelines-design.md), done)
  2. Frontend migration to Vite + TypeScript (next, against this backend)
  3. **Backend migration to Bun + TypeScript + GraphQL** ← this spec

## 1. Context

The legacy backend (`legacy/server.js`) is a 40-line Express server serving
`data/{fr,en}/*.json` under six `/api/:lang/*` routes and the webpack build. Header content
(name, job title, links, "Switch to:", "Email me!") is hard-coded in `legacy/src/components/Header.js`.

The backend is built first so that sub-project 2 consumes a real schema and a real endpoint
instead of mocks typed by hand.

### Decisions taken during brainstorming

| Topic | Decision |
|---|---|
| Order | Backend (sub-project 3) before frontend (sub-project 2) |
| Content storage | Typed TypeScript modules, checked with `satisfies` against generated types; `data/` is deleted |
| Schema | Hand-written SDL (`schema.graphql`) is the source of truth; GraphQL Code Generator produces types |
| Dates | TypeScript `Date` values on the server, sent as an ISO `Date` scalar; the frontend formats them per language with date-fns |
| Test runner | Vitest for the whole package (replaces `bun test` in `backend.md`) |
| Layout | `src/client/`, `src/server/`, `src/shared/` |
| Serving | API only: Bun serves `POST /graphql` with CORS; the frontend is hosted separately |
| Deployment | Out of scope: this sub-project ends with a `start` script and documented env vars |

## 2. Repository layout

```
src/
  client/
    App.tsx, main.tsx          moved from src/
  server/
    schema.graphql             source of truth
    gql/                       generated (committed; excluded from lint and coverage)
    content/
      shared.ts                language-neutral values: name, email, URLs, ratings, dates
      fr.ts, en.ts             per-language content, spreading shared.ts
      index.ts                 content: Readonly<Record<Lang, LangContent>>
    resolvers.ts               pure: (lang) → content[lang]
    yoga.ts                    createServer(config) → Yoga instance (testable via yoga.fetch)
    config.utils.ts            parseConfig(env) → Result<Config, string>
    main.ts                    entry point: parseConfig(process.env) → Bun.serve
  shared/
    result.ts                  Result<T, E> type and constructors
tests/
  client/App.test.tsx          moved from tests/
  server/                      yoga.test.ts, resolvers.test.ts, config.utils.test.ts,
                               content/index.test.ts
  shared/result.test.ts
  lint/, scripts/, support/    unchanged location
codegen.config.ts              schema → src/server/gql/
```

- `@/*` still maps to `src/*`: imports become `@/client/App`, `@/server/yoga`, `@/shared/result`.
- `index.html` loads `/src/client/main.tsx`.
- `src/shared/` holds pure TypeScript usable by both sides: no React, no DOM, no Bun APIs.
- `data/` is deleted once its content lives in `src/server/content/`. `legacy/` is untouched.

## 3. Schema

```graphql
scalar Date

enum Lang { FR EN }

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

enum LinkKind { GITHUB LINKEDIN BADGES }

type ProfileLink {
  kind: LinkKind!
  url: String!
  label: String!        # translated, e.g. "My GitHub profile"
}

type About {
  cover: [String!]!
  interests: [String!]!
}

type Skill {
  name: String!
  rating: Int!          # 0–100
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
  end: Date             # null = current position
  description: String!
  stack: [String!]!
}

type SpokenLanguage {
  name: String!
  rating: Float!        # 0–1
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
  present: String!      # shown when Experience.end is null
}

type AriaLabels {
  switchLanguage: String!
  retry: String!
  loading: String!
}

type SiteLanguage {
  code: Lang!
  label: String!        # in the requested language, e.g. lang FR → "Anglais"
}
```

### 3.1 The `Date` scalar

- Implemented with `DateResolver` from `graphql-scalars`: serialized as an ISO date string
  (`"2018-01-01"`), parsed from the same format.
- Codegen maps `Date` to TypeScript `Date` for server types (`scalars: { Date: 'Date' }`).
- The frontend codegen (sub-project 2) maps it to `string`; components parse it with date-fns
  `parseISO` and format per language.
- Content dates are UTC month starts, e.g. `new Date(Date.UTC(2018, 0, 1))`, so no timezone can
  shift a date into the previous month.
- `Education.year` stays `Int!`: the source data only has a year.

### 3.2 Changes from the legacy data

| Legacy | New |
|---|---|
| Hard-coded in `Header.js` | `Resume.profile` (name, job title, location, email, links with translated labels) |
| "me / blog / karib.it" top-menu links (no `href`) | Dropped |
| `start: "01/2018"`, `end: "now"` / `"maintenant"` | `start: Date!`, `end: Date` (`null` = current) |
| `stack: "a, b, c"` | `stack: [String!]!` |
| `contentClassName: "right"` (layout) | Dropped: the timeline alternates sides by index |
| `About.cover` / `interests` as `{ id, value }` | Plain `[String!]!` |
| `data/fr/Languages.json` names in English | "Anglais", "Français" |
| `Titles.json` | `Translations.sections` |

## 4. Content and resolvers

- `content/shared.ts` exports values that don't depend on the language (name, email, link URLs,
  skill and language ratings, dates, years). `fr.ts` and `en.ts` spread them into the
  per-language objects, so each value is written once.
- `fr.ts` and `en.ts` each export
  `{ resume, translations, siteLanguages } satisfies LangContent`, where `LangContent` is built
  from the generated types (`Resume`, `Translations`, `SiteLanguage[]`). A missing field or a
  wrong type is a compile error.
- `content/index.ts` exports `content = { FR: fr, EN: en } satisfies Record<Lang, LangContent>`,
  so a language added to the `Lang` enum without content fails `typecheck`.
- `resolvers.ts`, typed with the generated `Resolvers`:
  `Query.resume = (_, { lang }) => content[lang].resume`, and likewise for `translations` and
  `siteLanguages`, plus `Date: DateResolver`. No I/O.

## 5. Server, errors, CORS and config

### 5.1 Server

- `yoga.ts` exports `createServer(config: Config)`, which returns
  `createYoga({ schema, cors, graphiql, graphqlEndpoint: '/graphql' })`, with the schema built
  from `schema.graphql` and `resolvers` via `@graphql-tools/schema`.
- `main.ts` is the only side-effecting file: it calls `parseConfig(process.env)`; on `Err` it
  prints the message and exits 1 before binding a port; on `Ok` it runs
  `Bun.serve({ port, fetch: createServer(config) })`. It is exempt from coverage and
  `check-tests`, like `src/client/main.tsx`.

### 5.2 Errors

- Resolvers cannot fail: content is static and typed, and `lang` is validated by the `Lang` enum
  before any resolver runs.
- An invalid query or variable yields Yoga's standard GraphQL error response.
- Yoga's default error masking stays on: unexpected exceptions reach clients as
  `"Unexpected error."`, with details logged on the server.
- Only `/graphql` exists; other paths return 404.
- GraphiQL is enabled only when `NODE_ENV !== 'production'`.

### 5.3 CORS

- Allowed origins come from `CORS_ORIGINS` (comma-separated). Default when unset:
  `http://localhost:5173` (the Vite dev server).
- Passed to Yoga as `cors: { origin: [...origins], methods: ['POST'] }`; Yoga answers the
  `OPTIONS` preflight.

### 5.4 Config

```ts
type Config = Readonly<{
  port: number
  corsOrigins: ReadonlyArray<string>
  graphiql: boolean
}>

parseConfig(env: Readonly<Record<string, string | undefined>>): Result<Config, string>
```

- `PORT`: integer 1–65535; default `4000`.
- `CORS_ORIGINS`: entries are trimmed; each must be an `http:` or `https:` URL; an empty entry
  is an error.
- `graphiql`: `env.NODE_ENV !== 'production'`.
- The `Err` message names the variable and the invalid value.

## 6. Code generation

- `codegen.config.ts` (named `*.config.ts` so its default export is allowed by the lint rules),
  run with `graphql-codegen --config codegen.config.ts`.
- One output: `src/server/gql/types.ts` with the `typescript` and `typescript-resolvers`
  plugins, `scalars: { Date: 'Date' }`, `enumsAsTypes: true` (so `Lang` is `'FR' | 'EN'`, not a
  TypeScript `enum`), `useTypeImports: true`, `immutableTypes: true`.
- The frontend `client-preset` output (`src/client/gql/`) is added in sub-project 2, when the
  first query exists.
- Generated code is committed and excluded from ESLint, Prettier and coverage.
- Scripts:
  - `codegen`: runs the generator.
  - `check:gql`: runs the generator, then `git diff --exit-code -- src/server/gql`. It fails
    when regeneration changes the files compared with what is staged or committed, i.e. when the
    schema changed but `codegen` was not run. The regenerated files are left in place to stage.
- `verify` becomes
  `format:check → lint → typecheck → check:gql → check:tests → test`.

## 7. Tooling changes

| File | Change |
|---|---|
| `package.json` | Dependencies `graphql`, `graphql-yoga`, `@graphql-tools/schema`, `graphql-scalars`; dev `@graphql-codegen/cli`, `@graphql-codegen/typescript`, `@graphql-codegen/typescript-resolvers`, `@types/bun`; scripts `dev:server` (`bun --watch src/server/main.ts`), `start` (`bun src/server/main.ts`), `codegen`, `check:gql`; `verify` updated |
| `eslint.config.ts` | React / hooks / `jsx-no-literals` / `fetch` / arrow-component blocks move from `src/**` to `src/client/**`; new `src/server/**` block bans importing `react`, `react-dom` and using DOM globals (`window`, `document`); new `src/shared/**` block bans importing `react`, `react-dom`, `bun` and using `Bun`, `window`, `document`; `src/server/gql/**` ignored |
| `.prettierignore` | Adds `src/server/gql/` |
| `vitest.config.ts` | Coverage excludes become `src/client/main.tsx`, `src/server/main.ts`, `src/*/gql/**` |
| `tsconfig.json` | Adds `bun` to `types` (for `Bun.serve` in `main.ts`) |
| `index.html` | Script path `/src/client/main.tsx` |
| `scripts/lib/missingTests.ts` | Rules below |
| `CLAUDE.md` | Commands: `dev:server`, `start`, `codegen`; env vars `PORT`, `CORS_ORIGINS`, `NODE_ENV` |

`check-tests` rules after this sub-project:
- `src/client/**/*.tsx` and `src/client/**/*.utils.ts` need a mirrored test (unchanged rule, new
  root).
- Every `src/server/**/*.ts` and `src/shared/**/*.ts` needs a mirrored test.
- Exempt: `src/client/main.tsx`, `src/server/main.ts`, `src/*/gql/**`, and the data files
  `src/server/content/{shared,fr,en}.ts` (covered by `tests/server/content/index.test.ts`).

## 8. Test plan

All server and shared tests run under Vitest with `// @vitest-environment node`.

| Unit | Tests |
|---|---|
| `yoga.ts` | Real requests through `yoga.fetch` (no port). A `ResumePage`-shaped query returns FR and EN data; `Date` fields arrive as ISO strings; `end` is `null` for the current position; an invalid `lang` returns a GraphQL error; other paths return 404; a preflight from an allowed origin gets `Access-Control-Allow-Origin`, one from another origin doesn't; GraphiQL is served only when enabled. |
| `resolvers.ts` | Each `Query` field returns the requested language's content. |
| `content/index.ts` | Completeness: every string in every language is non-empty and not only whitespace, and a failure names the path (e.g. `EN.translations.aria.retry`). Both languages have the same list lengths and the same `id`s in the same order. Dates are UTC month starts and `end ≥ start`. Ratings are within 0–100 (skills) and 0–1 (spoken languages). Each `siteLanguages` list covers every `Lang`. |
| `config.utils.ts` | Defaults; valid and invalid `PORT` (non-numeric, 0, 65536); `CORS_ORIGINS` trimming, invalid URL, non-http scheme, empty entry; `graphiql` per `NODE_ENV`. |
| `shared/result.ts` | Constructors and narrowing. |
| Lint rules | `react` import flagged in `src/server`; `bun` / `react` import and `window` flagged in `src/shared`; client-only rules (`jsx-no-literals`, `fetch`) not applied to `src/server`. |
| `check-tests` | New server/shared mapping and exemptions. |

## 9. Guideline updates

- `backend.md` loses its "partial" status:
  - §2: tests run with Vitest (node environment); the `bun test` / `bunfig.toml` rules are
    removed, and coverage uses the package's Vitest 90% gate.
  - New rules, each enforced by a tool or marked **(review)**:
    - Resolvers are pure: no I/O, no mutation (functional lint rules; **(review)** for I/O).
    - Content is typed TypeScript checked with `satisfies` against generated types (`typecheck`).
    - Dates are `Date` values, sent as the ISO `Date` scalar; formatting belongs to the frontend
      **(review)**.
    - Configuration is read only through `parseConfig(process.env)` in `main.ts` **(review)**.
    - Error masking stays enabled; GraphiQL is off in production (`yoga.test.ts`).
    - Generated code is never edited by hand (`check:gql`).
    - No React, DOM or browser APIs in `src/server/` (ESLint).
- `common.md`: `Result` lives in `src/shared/result.ts`; `src/shared/` is runtime-neutral (ESLint).
- `frontend.md`: paths updated to `src/client/`.
- [`2026-09-21-react-guidelines-design.md`](2026-09-21-react-guidelines-design.md): a note at
  §2 pointing to this spec for the full schema, and its layout (§5) updated to `src/client/`.

## 10. Out of scope

- Hosting and deployment of the API and the frontend.
- The frontend `client-preset` codegen and every frontend component (sub-project 2).
- Persistence, authentication, mutations: the API is read-only over static content.
