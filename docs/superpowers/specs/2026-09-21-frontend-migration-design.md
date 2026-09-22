# Frontend Migration (Vite + React 19 + TypeScript): Implementation Design

- **Date:** 2026-09-21
- **Status:** Draft, awaiting review
- **Guidelines:** [`common.md`](../../guidelines/common.md) and
  [`frontend.md`](../../guidelines/frontend.md), extended by §9
- **Builds on:** [React guidelines design](2026-09-21-react-guidelines-design.md) §3–§6 (state,
  data flow, test plan) and [backend design](2026-09-21-backend-graphql-design.md) (schema,
  content). Where this spec differs, it wins.
- **Scope:** sub-project 2 of 3, the last one
  1. Guidelines + enforcement tooling (done)
  2. **Frontend migration** ← this spec
  3. Backend migration to Bun + GraphQL (done)

## 1. Context

`src/client/` holds a minimal scaffold (`App` renders `<main />`). The legacy React 16 app in
`legacy/src/` (Redux, Ramda pipelines, `react-highcharts`, d3, SCSS, CDN assets) is reference
only. The GraphQL API in `src/server/` serves all content and UI strings.

### Decisions taken during brainstorming

| Topic | Decision |
|---|---|
| Visual scope | Faithful port of the legacy look; a redesign is a separate, later project |
| Styling | CSS Modules in plain CSS, one file per component; legacy SCSS variables become custom properties in `styles/theme.css` |
| Skills chart | Hand-drawn SVG radar; geometry from `d3-scale` in a pure, tested util; `react-highcharts` and Highcharts are dropped |
| Language chart | Legacy d3 ring geometry ported to JSX SVG (`d3-shape`) |
| Assets | Bundled: `react-icons` (Font Awesome set), two inline SVG flags, self-hosted font via `@fontsource`; no CDN at runtime |
| API location | `VITE_GRAPHQL_URL`, default `http://localhost:4000/graphql` (the API serves CORS) |
| Legacy | `legacy/` is deleted at the end of this sub-project |

## 2. Layout

```
src/client/
  main.tsx                     createRoot → <StrictMode><LanguageProvider><App/></LanguageProvider>
  App.tsx                      useResumePage(lang) → Loading | LoadError | Header + HomePage
  api/
    graphql.ts                 request(document, variables, signal) → Promise<Result<TData, ApiError>>
    graphql.utils.ts           toApiError, parseResponse (pure)
  hooks/
    useResumePage.ts           request status union
  i18n/
    LanguageContext.tsx        LanguageProvider, useLanguage
    languages.utils.ts         otherLanguages, formatMonth
    ResumePage.graphql         the page query
  gql/                         graphql.ts: operation types + ResumePageDocument (generated, committed)
  components/
    SectionTitle/SectionTitle.tsx
    Header/Header.tsx, Header.utils.ts, Flag.tsx
    AboutMe/AboutMe.tsx
    Skills/Skills.tsx, Skills.utils.ts
    Education/Education.tsx
    Languages/Languages.tsx, LanguageRing.tsx, Languages.utils.ts
    Timeline/Timeline.tsx, TimelineItem.tsx, Timeline.utils.ts
    HomePage/HomePage.tsx
    Loading/Loading.tsx
    LoadError/LoadError.tsx
    */X.module.css             one stylesheet per component
  styles/theme.css             custom properties, font import, base element styles
tests/client/                  mirrors src/client/
tests/support/
  fixtures.ts                  typed ResumePageQuery fixtures built from the real content
  handlers.ts                  default MSW handler for ResumePage
  renderWithProviders.tsx      render inside LanguageProvider
```

`*.module.css` files are not TypeScript and are not covered by `check-tests`.

## 3. Data

### 3.1 Query and code generation

The document lives in `src/client/api/ResumePage.graphql`:

```graphql
query ResumePage($lang: Lang!) {
  resume(lang: $lang) {
    profile { name jobTitle location email links { kind url label } }
    about { cover interests }
    skills { name rating }
    educations { id year school location title }
    experiences { id title company start end description stack }
    spokenLanguages { name rating }
  }
  translations(lang: $lang) {
    sections { about skills education languages experiences }
    header { switchTo emailMe }
    timeline { present description stack }
    aria { switchLanguage retry loading }
  }
  siteLanguages(lang: $lang) { code label }
}
```

- `codegen.config.ts` gains a second output, `src/client/gql/graphql.ts`, from
  `documents: ['src/client/**/*.graphql']` with the `typescript-operations` and
  `typed-document-node` plugins and
  `config: { scalars: { Date: 'string' }, enumsAsTypes: true, useTypeImports: true, immutableTypes: true }`.
  It exports the operation types and a precompiled
  `ResumePageDocument: TypedDocumentNode<ResumePageQuery, ResumePageQueryVariables>`.
- The `client-preset` is not used: its `graphql()` types are keyed by the full query text, it
  falls back to `unknown` / `{}` on any mismatch, and it ships each query twice.
- `check:gql` diffs both `src/server/gql` and `src/client/gql`.
- The client never imports from `src/server/` (ESLint, §9). The schema file is shared through
  codegen only.

### 3.2 Backend change

`TimelineLabels` gains two fields, needed by the legacy timeline's "Description:" / "Stack:"
labels:

```graphql
type TimelineLabels {
  present: String!
  description: String!
  stack: String!
}
```

| Field | FR | EN |
|---|---|---|
| `present` | Aujourd'hui | Present |
| `description` | Descriptif | Description |
| `stack` | Technologies | Stack |

The content test's "translates every translatable string" rule covers them. Server types are
regenerated.

### 3.3 API layer

```ts
type ApiError =
  | Readonly<{ kind: 'network' }>
  | Readonly<{ kind: 'http'; status: number }>
  | Readonly<{ kind: 'graphql'; messages: ReadonlyArray<string> }>
  | Readonly<{ kind: 'parse' }>
  | Readonly<{ kind: 'aborted' }>

request<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  signal: AbortSignal,
): Promise<Result<TData, ApiError>>
```

- `POST` to `import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql'` with
  `{ query: print(document), variables }`.
- Never throws: `fetch` rejection → `network` (or `aborted` when `signal.aborted`), non-2xx →
  `http`, body not JSON or without `data` → `parse`, non-empty `errors` → `graphql`.
- The response mapping is pure in `graphql.utils.ts` (`parseResponse(status, body)`), so
  `graphql.ts` only does I/O.
- `src/vite-env.d.ts` declares `ImportMetaEnv.VITE_GRAPHQL_URL?: string`.

### 3.4 `useResumePage(lang)`

```ts
type ResumePageState =
  | Readonly<{ status: 'loading' }>
  | Readonly<{ status: 'error'; error: ApiError; retry: () => void }>
  | Readonly<{ status: 'success'; data: ResumePageQuery }>
```

- On mount, on `lang` change and on `retry()`: state becomes `loading`, a new `AbortController`
  aborts the previous request, and only the latest request's result is applied.
- `aborted` results are ignored (never shown as errors).

### 3.5 Language

Unchanged from the React guidelines design §3.1: `LanguageProvider` (`useState<Lang>`, default
`FR`, `initialLang` prop), `useLanguage()` throws outside the provider, and the provider syncs
`document.documentElement.lang` (`fr` / `en`).

`languages.utils.ts`:
- `otherLanguages(current, siteLanguages)`: every site language except the current one.
- `formatMonth(iso, lang)`: `parseISO` + date-fns `format` with the matching locale (`fr` /
  `enUS`): `MM/yyyy` in FR, `MMM yyyy` in EN.

## 4. Components

Translations flow down as props (`t`). Only `App` calls `useResumePage`; only `Header` calls
`useLanguage`. Props are `Readonly<…>` and named `<Component>Props`.

| Component | Props | Renders |
|---|---|---|
| `App` | none | `Loading` / `LoadError retry` / `Header` + `HomePage` |
| `Header` | `profile`, `t: HeaderLabels`, `aria`, `languages` | Top bar: `switchTo` + one `<button>` per other language (flag icon, `aria-label` = `aria.switchLanguage` + language label); nav: email (`mailto:`, `emailMe`), each profile link with its icon and label, name, job title, location |
| `Flag` | `code: Lang` | Inline SVG flag (FR, US), grayscale like the legacy `flag-icon` style |
| `SectionTitle` | `text` | `<h2>` |
| `AboutMe` | `about`, `title` | Cover paragraphs, interests `<ul>` |
| `Skills` | `skills`, `title` | Section with `SectionTitle` and the SVG radar |
| `Education` | `educations`, `title` | Year, title, school, location per entry |
| `Languages` | `spokenLanguages`, `title` | One `LanguageRing` per language in one SVG row |
| `LanguageRing` | `name`, `rating`, `height` | Background ring, rounded progress arc, centre circle, name and percentage |
| `Timeline` | `experiences`, `title`, `t: TimelineLabels`, `lang` | `TimelineItem`s alternating left/right by index |
| `TimelineItem` | `experience`, `t`, `lang`, `side` | "title, company", date range (`formatMonth`, `present` when `end` is `null`), description and stack (joined with `, `) under their labels |
| `HomePage` | `resume`, `t: SectionTitles`, `timeline`, `lang` | Sections in legacy order: About, Skills, Education, Languages, Experience |
| `Loading` | `lang` | `aria-busy` spinner, `aria-label` from a local fallback |
| `LoadError` | `lang`, `retry` | Warning icon and a retry `<button>`, `aria-label` from a local fallback |

`Loading` and `LoadError` render before translations exist, so both use a local fallback
(`{ FR: 'Chargement', EN: 'Loading' }`, `{ FR: 'Réessayer', EN: 'Retry' }`). This is the
documented `react/jsx-no-literals` exception, scoped to these two files.

`Header.utils.ts` maps `LinkKind` to its `react-icons` component (`FaGithub`, `FaLinkedin`,
`FaCertificate`); email uses `FaEnvelope`, `LoadError` uses `FaTriangleExclamation`.

## 5. Charts

### 5.1 Skills radar (`Skills.utils.ts`)

```ts
radarGeometry(skills: ReadonlyArray<Skill>, size: number): Readonly<{
  center: number
  axes: ReadonlyArray<Readonly<{ x: number; y: number }>>
  rings: ReadonlyArray<string>                    // polygon points at 25/50/75/100
  polygon: string                                 // skill values
  labels: ReadonlyArray<Readonly<{ x: number; y: number; anchor: 'start' | 'middle' | 'end'; text: string }>>
}>
```

- Radius = 80% of `size / 2` (the legacy `pane.size: '80%'`); `scaleLinear` maps 0–100 to
  0–radius.
- Axis `i` sits at angle `2π·i/n`, starting at 12 o'clock, clockwise.
- Label anchor: `middle` within 10° of the vertical axis, `start` on the right, `end` on the left.
- `Skills.tsx` renders `<svg role="img" aria-labelledby={titleId}>` with a `<title>`, the rings,
  axes, the polygon, labels, and one `<circle>` per value containing `<title>` "C# 90%".

### 5.2 Language rings (`Languages.utils.ts`)

Ported verbatim from `legacy/src/components/LanguageChart.utils.js`:
- `ringRadii(height)`: outer `height / 2 − 10`, inner `outer − 20`.
- `backgroundArc(radii)`: full circle; `progressArc(radii, rating)`: from `−0.05` to
  `2π × rating`, corner radius 20 (`d3-shape` `arc`).
- `LanguageRing` renders both paths, the centre circle and text; the two inset-shadow filters
  get ids from `useId()`.
- `Languages` renders an SVG `500 × 190` (the legacy size) with rings side by side.

## 6. Styles and assets

- `styles/theme.css`, imported once in `main.tsx`:
  - custom properties for every `_variables.scss` value that the ported styles use (colors,
    spacing, the timeline colors)
  - `@import '@fontsource/josefin-sans'` weights 300/400/700: the only font the legacy styles
    use (`homePage.scss`); the four other Google Fonts imported by `_externals.scss` are unused
    and dropped
  - base element styles from `homePage.scss`
- Each component's `X.module.css` translates its legacy stylesheet:

| Component | Legacy source |
|---|---|
| `Header` | `components/header.scss` |
| `HomePage`, `SectionTitle` | `homePage.scss`, `components/content-layout.scss`, `components/subSection.scss` |
| `Timeline`, `TimelineItem` | `timeline.scss`, `components/exp.scss` |
| `Skills`, `Languages`, `AboutMe`, `Education` | `components/components.scss`, `components/subSection.scss` |
| `Loading`, `LoadError` | new (spinner, centred message) |

- `components/footer.scss` has no matching component in the legacy app and is not ported.
- `index.html`: `<link rel="icon" href="/favicon.ico">`, with `legacy/src/favicon.ico` moved to
  `public/favicon.ico`.
- Visual fidelity is checked by hand (`bun run dev` + `bun run dev:server`) against the legacy
  stylesheets and any screenshot of the old site; the old app no longer builds. Each styling PR
  names the legacy files it ports.

## 7. Error handling

| Situation | UI |
|---|---|
| First load / language switch | `Loading` |
| Network failure, HTTP error, GraphQL errors, unparseable body | `LoadError` with retry |
| Aborted request (superseded by a newer one) | Nothing: the newer request's state wins |
| Retry | `Loading`, then success or `LoadError` again |

Errors are values end to end; no component throws on bad data because the data is typed by
codegen and validated by the backend's content tests.

## 8. Test plan

Vitest (jsdom), Testing Library, MSW; the React guidelines design §6 applies, with these
changes:

- `tests/support/fixtures.ts`: `resumePageFixture(lang): ResumePageQuery`, built from
  `@/server/content` (dates mapped to ISO strings with the same `YYYY-MM-DD` format as the
  scalar). Fixtures cannot drift from the real data.
- `tests/support/handlers.ts`: `graphql.query('ResumePage', …)` returns the fixture for the
  requested `lang`.
- `tests/support/renderWithProviders.tsx`: `renderWithProviders(ui, { lang })`.
- The Highcharts `vi.mock` row is removed: both charts render in jsdom.

| Unit | Tests |
|---|---|
| `graphql.utils.ts` | Every `parseResponse` branch: success, non-2xx, invalid JSON, missing `data`, `errors` |
| `api/graphql.ts` | Through MSW: success; network error (`HttpResponse.error()`); HTTP 500; GraphQL `errors`; abort → `aborted`; never rejects |
| `useResumePage` | `renderHook` + MSW: loading → success; loading → error for each failure; `retry` refetches; FR → EN → FR with delayed responses, FR wins; abort never surfaces as error |
| `LanguageContext` | Default `FR`; `initialLang`; `setLang` updates consumers and `<html lang>`; `useLanguage` throws outside the provider |
| `languages.utils.ts` | `otherLanguages`; `formatMonth` per language |
| `Skills.utils.ts` | Axis angles, ring and polygon points for known inputs, label anchors |
| `Languages.utils.ts` | Radii; arc paths start/end for ratings 0.5 and 1 |
| `Header.utils.ts`, `Timeline.utils.ts` | Icon per `LinkKind`; side alternation |
| Components | Plain `render` with fixture props (except `Header`: `renderWithProviders`): text, titles from `t`, roles (`img` charts with their titles, `button`s, `list`s), `present` label for the current job |
| `App` | Loading → header and all five sections; clicking the EN button switches content and `<html lang>`; HTTP 500 → `LoadError` → retry → success |
| Lint | Client importing `@/server/*` is rejected, except in `tests/support/fixtures.ts` |

## 9. Tooling and guideline changes

- Dependencies: `date-fns`, `d3-scale`, `d3-shape`, `react-icons`, `@fontsource/josefin-sans`,
  `@graphql-typed-document-node/core`; dev: `@graphql-codegen/typescript-operations`,
  `@graphql-codegen/typed-document-node`, `@types/d3-scale`,
  `@types/d3-shape`.
- `codegen.config.ts`: client output (§3.1). `.prettierignore` already ignores `src/*/gql/`.
- ESLint:
  - `src/client/**` may not import `@/server/*` (`no-restricted-imports`), with a rule test.
  - `tests/support/fixtures.ts` may import `@/server/content` (scoped override).
  - `react/jsx-no-literals` off for `src/client/components/Loading/Loading.tsx` and
    `src/client/components/LoadError/LoadError.tsx` only.
- `legacy/` is deleted in the last task, together with its entries in `globalIgnores` and
  `.prettierignore`, and the "legacy" note in `CLAUDE.md`.
- `frontend.md` additions: styles are CSS Modules next to their component, with shared values as
  custom properties in `styles/theme.css`; icons come from `react-icons`; fonts are self-hosted;
  charts are JSX SVG with their geometry in pure `*.utils.ts`; the API URL comes from
  `VITE_GRAPHQL_URL`.
- `CLAUDE.md`: `VITE_GRAPHQL_URL` and running `dev` + `dev:server` together.

## 10. Out of scope

- Visual redesign, responsive layout work beyond what the legacy styles do.
- Hosting and deployment.
- Persisting the chosen language, browser-language detection (as in the React guidelines design).
