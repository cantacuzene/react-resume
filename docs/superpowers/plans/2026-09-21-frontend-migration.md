# Frontend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the legacy React 16 resume to `src/client/` (React 19, TypeScript, CSS Modules),
fed by the GraphQL API, with the legacy look, then delete `legacy/`.

**Architecture:** `LanguageProvider` holds the language; `App` reads it and calls
`useResumePage(lang)`, which runs the codegen-typed `ResumePage` query through a
never-throwing `request()` and exposes a `loading | error | success` union. Presentational
components receive data and translations as props; charts are JSX SVG with geometry in pure
utils.

**Tech Stack:** React 19, Vite 8, TypeScript `~6.0`, GraphQL Code Generator `client-preset`,
date-fns, d3-scale, d3-shape, react-icons, `@fontsource/josefin-sans`, Vitest 5 + Testing Library
+ MSW 2.

**Spec:** `docs/superpowers/specs/2026-09-21-frontend-migration-design.md` (builds on
`2026-09-21-react-guidelines-design.md` §3–§6 and `2026-09-21-backend-graphql-design.md`).

## Global Constraints

- Tests mirror `src/` exactly under `tests/`; every `src/client/**/*.tsx` and `*.utils.ts` has
  its test (`check-tests`). Tests import sources through `@/`.
- No semicolons, single quotes, trailing commas, 100 columns. Named exports only; components are
  arrow constants with `Readonly<…Props>`; no classes, `let`, loops, mutation; `type` not
  `interface`.
- No hard-coded UI text in `src/client/**/*.tsx` (`react/jsx-no-literals`): punctuation between
  values ("title, company", "start – end", "Label:") comes from CSS `::before` / `::after`.
  Only `Loading.tsx` and `LoadError.tsx` carry local FR/EN fallback labels.
- Tests query by role / label / text, never test ids; no snapshots; mock only the network (MSW).
- `src/client/**` never imports `@/server/*`. `tests/support/fixtures.ts` may.
- Generated code (`src/*/gql/`) is committed, never edited; `check:gql` must pass.
- Coverage ≥ 90% lines and branches.
- Never disable or weaken a lint rule or test to make it pass. If an installed tool behaves
  differently from this plan, adapt minimally, keep the behaviour under test, and note it in the
  PR body.
- Every commit passes the Lefthook hook (`bun run verify`); never `--no-verify`.
- Commit message: conventional subject, blank line,
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- One GitHub issue (label `enhancement`) with a checkbox per task; one branch and PR per task,
  stacked: task 1's branch `frontend/1-timeline-labels` starts from `master` and its PR targets
  `master`; task N branches from task N−1 and targets it. `Part of #<issue>`; task 11
  `Closes #<issue>`. Slugs: `1-timeline-labels`, `2-client-codegen`, `3-api-layer`,
  `4-language`, `5-use-resume-page`, `6-theme-shell`, `7-header`, `8-sections`, `9-charts`,
  `10-app`, `11-remove-legacy`.

### Spec clarifications made while planning

> **Changed during review of #24:** the client codegen uses `typescript-operations` +
> `typed-document-node` instead of the `client-preset`. The query lives in
> `src/client/api/ResumePage.graphql`, `documents.ts` does not exist, and consumers import
> `ResumePageDocument` from `@/client/gql/graphql`. Task 2's code blocks below show the original
> client-preset version; the spec (§3.1) describes the final one.

- The `ResumePage` document lives in `src/client/api/documents.ts` (not inline in the hook), so
  codegen, fixtures and the hook share it before the hook exists. `src/client/api/types.ts`
  names the generated sub-types (`Resume`, `Profile`, …).
- `App` also calls `useLanguage()` (it needs `lang` for `useResumePage`); `Header` is the only
  component that calls `setLang`.
- The language switcher is a `role="group"` labelled `aria.switchLanguage`, whose buttons are
  labelled with each language's name. This avoids joining two strings in an `aria-label`.
- The API URL is read as `unknown` and validated by `resolveGraphqlUrl` in `graphql.utils.ts`,
  instead of augmenting `ImportMetaEnv` (which would need an `interface`).
- The client codegen output sets `immutableTypes: true`, so fixtures built from the (readonly)
  server content type-check.

## File Map

| Task | Files |
|---|---|
| 1 | `src/server/schema.graphql`, `src/server/gql/types.ts`, `src/server/content/{fr,en}.ts`, `tests/server/content/index.test.ts` |
| 2 | `codegen.config.ts`, `src/client/gql/*`, `src/client/api/{documents,types}.ts`, `package.json`, `eslint.config.ts`, `tests/lint/frontend.test.ts`, `tests/support/{fixtures,handlers}.ts` |
| 3 | `src/client/api/graphql.utils.ts`, `src/client/api/graphql.ts` + tests |
| 4 | `src/client/i18n/LanguageContext.tsx`, `src/client/i18n/languages.utils.ts`, `tests/support/renderWithProviders.tsx` + tests |
| 5 | `src/client/hooks/useResumePage.ts` + test |
| 6 | `src/client/styles/theme.css`, `public/favicon.ico`, `index.html`, `src/client/main.tsx`, `SectionTitle`, `Loading`, `LoadError`, `eslint.config.ts` + tests |
| 7 | `Header`, `Header.utils.ts`, `Flag` + tests |
| 8 | `AboutMe`, `Education`, `Timeline`, `TimelineItem`, `Timeline.utils.ts` + tests |
| 9 | `Skills`, `Skills.utils.ts`, `Languages`, `LanguageRing`, `Languages.utils.ts` + tests |
| 10 | `HomePage`, `App.tsx` + tests |
| 11 | delete `legacy/`; `eslint.config.ts`, `.prettierignore`, `docs/guidelines/frontend.md`, `CLAUDE.md` |

Component files live in `src/client/components/<Name>/<Name>.tsx` with `<Name>.module.css`
beside them, tests in `tests/client/components/<Name>/<Name>.test.tsx`.

---

### Task 1: Timeline labels in the schema

**Files:** Modify `src/server/schema.graphql`, `src/server/content/fr.ts`,
`src/server/content/en.ts`, `tests/server/content/index.test.ts`; regenerate
`src/server/gql/types.ts`.

**Interfaces:** Produces `TimelineLabels { present description stack }`.

- [ ] **Step 1: Branch** — `git checkout master && git pull --ff-only && git checkout -b frontend/1-timeline-labels`
- [ ] **Step 2: Failing test** — in `tests/server/content/index.test.ts` add:

```ts
  it('labels the timeline fields in both languages', () => {
    expect(fr.translations.timeline).toEqual({
      present: "Aujourd'hui",
      description: 'Descriptif',
      stack: 'Technologies',
    })
    expect(en.translations.timeline).toEqual({
      present: 'Present',
      description: 'Description',
      stack: 'Stack',
    })
  })
```

Run `bunx vitest run tests/server/content` → FAIL (fields missing).

- [ ] **Step 3: Schema + content** — in `schema.graphql`:

```graphql
type TimelineLabels {
  "Shown when Experience.end is null"
  present: String!
  description: String!
  stack: String!
}
```

Run `bun run codegen`. In `fr.ts` set
`timeline: { present: "Aujourd'hui", description: 'Descriptif', stack: 'Technologies' }`; in
`en.ts` `timeline: { present: 'Present', description: 'Description', stack: 'Stack' }`.

- [ ] **Step 4: Verify** — `bunx vitest run tests/server` PASS; `bun run verify` exit 0.
- [ ] **Step 5: Commit** — `feat: add description and stack timeline labels`.

---

### Task 2: Client codegen, ResumePage document, fixtures and the client/server boundary

**Files:** Modify `codegen.config.ts`, `package.json`, `eslint.config.ts`,
`tests/lint/frontend.test.ts`, `tests/support/handlers.ts`; create `src/client/api/documents.ts`,
`src/client/api/types.ts`, `src/client/gql/*` (generated), `tests/support/fixtures.ts`,
`tests/support/fixtures.test.ts`.

**Interfaces:**
- `ResumePageDocument: TypedDocumentNode<ResumePageQuery, ResumePageQueryVariables>`
- `types.ts`: `Lang`, `ResumePageQuery`, `Resume`, `Profile`, `ProfileLink`, `Skill`,
  `Education`, `Experience`, `SpokenLanguage`, `Translations`, `SectionTitles`, `HeaderLabels`,
  `TimelineLabels`, `AriaLabels`, `SiteLanguage`
- `resumePageFixture(lang: Lang): ResumePageQuery`
- `handlers` answers `ResumePage` with the fixture for `variables.lang`

- [ ] **Step 1: Branch + deps**

```bash
git checkout -b frontend/2-client-codegen
bun add @graphql-typed-document-node/core
bun add -d @graphql-codegen/client-preset
```

- [ ] **Step 2: Codegen config** — add to `generates` in `codegen.config.ts`:

```ts
    'src/client/gql/': {
      preset: 'client',
      documents: ['src/client/**/*.{ts,tsx}', '!src/client/gql/**'],
      presetConfig: { fragmentMasking: false },
      config: {
        scalars: { Date: 'string' },
        enumsAsTypes: true,
        useTypeImports: true,
        immutableTypes: true,
      },
    },
```

`package.json`: `"check:gql": "bun run codegen && git diff --exit-code -- src/server/gql src/client/gql"`.

- [ ] **Step 3: Document and types**

`src/client/api/documents.ts`:

```ts
import { graphql } from '@/client/gql'

export const ResumePageDocument = graphql(`
  query ResumePage($lang: Lang!) {
    resume(lang: $lang) {
      profile {
        name
        jobTitle
        location
        email
        links {
          kind
          url
          label
        }
      }
      about {
        cover
        interests
      }
      skills {
        name
        rating
      }
      educations {
        id
        year
        school
        location
        title
      }
      experiences {
        id
        title
        company
        start
        end
        description
        stack
      }
      spokenLanguages {
        name
        rating
      }
    }
    translations(lang: $lang) {
      sections {
        about
        skills
        education
        languages
        experiences
      }
      header {
        switchTo
        emailMe
      }
      timeline {
        present
        description
        stack
      }
      aria {
        switchLanguage
        retry
        loading
      }
    }
    siteLanguages(lang: $lang) {
      code
      label
    }
  }
`)
```

Run `bun run codegen` (the first run creates `src/client/gql/` with `index.ts`, `gql.ts`,
`graphql.ts`).

`src/client/api/types.ts`:

```ts
import type { Lang, ResumePageQuery } from '@/client/gql/graphql'

export type { Lang, ResumePageQuery }
export type Resume = ResumePageQuery['resume']
export type Profile = Resume['profile']
export type ProfileLink = Profile['links'][number]
export type Skill = Resume['skills'][number]
export type Education = Resume['educations'][number]
export type Experience = Resume['experiences'][number]
export type SpokenLanguage = Resume['spokenLanguages'][number]
export type Translations = ResumePageQuery['translations']
export type SectionTitles = Translations['sections']
export type HeaderLabels = Translations['header']
export type TimelineLabels = Translations['timeline']
export type AriaLabels = Translations['aria']
export type SiteLanguage = ResumePageQuery['siteLanguages'][number]
```

- [ ] **Step 4: Failing fixtures test** — `tests/support/fixtures.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resumePageFixture } from './fixtures'

describe('resumePageFixture', () => {
  it('serializes dates like the Date scalar', () => {
    const [current] = resumePageFixture('EN').resume.experiences

    expect(current).toMatchObject({ id: '5', start: '2018-01-01', end: null })
  })

  it('returns the requested language', () => {
    expect(resumePageFixture('FR').translations.sections.about).toBe('À propos')
    expect(resumePageFixture('EN').translations.sections.about).toBe('About')
  })
})
```

Run → FAIL (no `./fixtures`).

- [ ] **Step 5: Fixtures and default handler**

`tests/support/fixtures.ts`:

```ts
import type { Lang, ResumePageQuery } from '@/client/api/types'
import { content } from '@/server/content'

// Same format as the server's Date scalar (graphql-scalars DateResolver)
const toIsoDate = (date: Readonly<Date>): string => date.toISOString().slice(0, 10)

export const resumePageFixture = (lang: Lang): ResumePageQuery => {
  const { resume, translations, siteLanguages } = content[lang]

  return {
    resume: {
      ...resume,
      experiences: resume.experiences.map((experience) => ({
        ...experience,
        start: toIsoDate(experience.start),
        end: experience.end ? toIsoDate(experience.end) : null,
      })),
    },
    translations,
    siteLanguages,
  }
}
```

`tests/support/handlers.ts`:

```ts
import { graphql, HttpResponse, type RequestHandler } from 'msw'
import type { Lang } from '@/client/api/types'
import { resumePageFixture } from './fixtures'

// Default handlers shared by all tests
export const handlers: ReadonlyArray<RequestHandler> = [
  graphql.query<object, { lang: Lang }>('ResumePage', ({ variables }) =>
    HttpResponse.json({ data: resumePageFixture(variables.lang) }),
  ),
]
```

Run `bunx vitest run tests/support` → PASS.

- [ ] **Step 6: Boundary lint rule** — failing test in `tests/lint/frontend.test.ts`:

```ts
  it('forbids server imports in client code', async () => {
    expect(
      await lintViolations(
        source,
        "import { content } from '@/server/content'\n\nexport const c = content\n",
      ),
    ).toContain('no-restricted-imports')
  })
```

Then add to `eslint.config.ts`, before the server block:

```ts
  // docs/guidelines/frontend.md §2: the client reaches the server over GraphQL only
  {
    files: ['src/client/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/server/*'],
              message:
                'The client talks to the server over GraphQL only (docs/guidelines/frontend.md §2).',
            },
          ],
        },
      ],
    },
  },
```

- [ ] **Step 7: Verify + commit** — `bun run verify` exit 0 (`check:gql` covers both outputs).
  Commit `feat: generate client GraphQL types and share typed fixtures`.

---

### Task 3: API layer

**Files:** Create `src/client/api/graphql.utils.ts`, `src/client/api/graphql.ts`,
`tests/client/api/graphql.utils.test.ts`, `tests/client/api/graphql.test.ts`.

**Interfaces:**
- `ApiError` union (network | http status | graphql messages | parse | aborted)
- `DEFAULT_GRAPHQL_URL = 'http://localhost:4000/graphql'`
- `resolveGraphqlUrl(value: unknown): string`
- `parseResponse<TData>(status: number, body: unknown): Result<TData, ApiError>`
- `request<TData, TVariables>(document, variables, signal): Promise<Result<TData, ApiError>>`

- [ ] **Step 1: Branch** — `git checkout -b frontend/3-api-layer`
- [ ] **Step 2: Failing utils test** — `tests/client/api/graphql.utils.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_GRAPHQL_URL,
  parseResponse,
  resolveGraphqlUrl,
} from '@/client/api/graphql.utils'

describe('resolveGraphqlUrl', () => {
  it('uses a configured URL', () => {
    expect(resolveGraphqlUrl('https://api.example/graphql')).toBe('https://api.example/graphql')
  })

  it.each([undefined, '', 42])('falls back to the default for %j', (value) => {
    expect(resolveGraphqlUrl(value)).toBe(DEFAULT_GRAPHQL_URL)
  })
})

describe('parseResponse', () => {
  it('returns the data of a successful response', () => {
    expect(parseResponse(200, { data: { a: 1 } })).toEqual({ ok: true, value: { a: 1 } })
  })

  it('reports non-2xx statuses', () => {
    expect(parseResponse(500, { data: null })).toEqual({
      ok: false,
      error: { kind: 'http', status: 500 },
    })
  })

  it('reports GraphQL errors', () => {
    expect(parseResponse(200, { errors: [{ message: 'boom' }, {}] })).toEqual({
      ok: false,
      error: { kind: 'graphql', messages: ['boom', 'Unknown GraphQL error'] },
    })
  })

  it.each([undefined, 'text', { data: null }, {}])('reports an unusable body %j', (body) => {
    expect(parseResponse(200, body)).toEqual({ ok: false, error: { kind: 'parse' } })
  })
})
```

Run → FAIL.

- [ ] **Step 3: Implement utils** — `src/client/api/graphql.utils.ts`:

```ts
import { err, ok, type Result } from '@/shared/result'

export type ApiError =
  | Readonly<{ kind: 'network' }>
  | Readonly<{ kind: 'http'; status: number }>
  | Readonly<{ kind: 'graphql'; messages: ReadonlyArray<string> }>
  | Readonly<{ kind: 'parse' }>
  | Readonly<{ kind: 'aborted' }>

// The GraphQL API's dev address (src/server, PORT default 4000)
export const DEFAULT_GRAPHQL_URL = 'http://localhost:4000/graphql'

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null

export const resolveGraphqlUrl = (value: unknown): string =>
  typeof value === 'string' && value !== '' ? value : DEFAULT_GRAPHQL_URL

const errorMessage = (error: unknown): string =>
  isRecord(error) && typeof error.message === 'string' ? error.message : 'Unknown GraphQL error'

export const parseResponse = <TData>(status: number, body: unknown): Result<TData, ApiError> => {
  if (status < 200 || status >= 300) {
    return err({ kind: 'http', status })
  }
  if (!isRecord(body)) {
    return err({ kind: 'parse' })
  }
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    return err({ kind: 'graphql', messages: body.errors.map(errorMessage) })
  }
  // The shape of `data` is guaranteed by the typed document the server validated
  return isRecord(body.data) ? ok(body.data as TData) : err({ kind: 'parse' })
}
```

Run → PASS.

- [ ] **Step 4: Failing request test** — `tests/client/api/graphql.test.ts`:

```ts
import { delay, graphql as mockGraphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { ResumePageDocument } from '@/client/api/documents'
import { request } from '@/client/api/graphql'
import { server } from '../../support/server'

const run = (signal = new AbortController().signal) =>
  request(ResumePageDocument, { lang: 'EN' }, signal)

describe('request', () => {
  it('returns the data', async () => {
    const result = await run()

    expect(result.ok && result.value.translations.sections.about).toBe('About')
  })

  it('reports network failures', async () => {
    server.use(mockGraphql.query('ResumePage', () => HttpResponse.error()))

    expect(await run()).toEqual({ ok: false, error: { kind: 'network' } })
  })

  it('reports HTTP errors', async () => {
    server.use(
      mockGraphql.query('ResumePage', () => HttpResponse.json({}, { status: 500 })),
    )

    expect(await run()).toEqual({ ok: false, error: { kind: 'http', status: 500 } })
  })

  it('reports GraphQL errors', async () => {
    server.use(
      mockGraphql.query('ResumePage', () =>
        HttpResponse.json({ errors: [{ message: 'Unexpected error.' }] }),
      ),
    )

    expect(await run()).toEqual({
      ok: false,
      error: { kind: 'graphql', messages: ['Unexpected error.'] },
    })
  })

  it('reports an unparseable body', async () => {
    server.use(mockGraphql.query('ResumePage', () => new HttpResponse('not json')))

    expect(await run()).toEqual({ ok: false, error: { kind: 'parse' } })
  })

  it('reports an aborted request without throwing', async () => {
    server.use(
      mockGraphql.query('ResumePage', async () => {
        await delay(1_000)
        return HttpResponse.json({ data: null })
      }),
    )
    const controller = new AbortController()
    const pending = run(controller.signal)
    controller.abort()

    expect(await pending).toEqual({ ok: false, error: { kind: 'aborted' } })
  })
})
```

Run → FAIL.

- [ ] **Step 5: Implement request** — `src/client/api/graphql.ts`:

```ts
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { print } from 'graphql'
import { type ApiError, parseResponse, resolveGraphqlUrl } from '@/client/api/graphql.utils'
import { err, type Result } from '@/shared/result'

const GRAPHQL_URL = resolveGraphqlUrl(import.meta.env.VITE_GRAPHQL_URL)

// The only module that calls fetch (docs/guidelines/frontend.md §2). Never throws.
export const request = async <TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: Readonly<TVariables>,
  signal: Readonly<AbortSignal>,
): Promise<Result<TData, ApiError>> => {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: print(document), variables }),
      signal,
    })
    const body: unknown = await response.json().catch(() => undefined)
    return parseResponse<TData>(response.status, body)
  } catch {
    return err(signal.aborted ? { kind: 'aborted' } : { kind: 'network' })
  }
}
```

Run → PASS.

- [ ] **Step 6: Verify + commit** — `bun run verify`; commit
  `feat: add a never-throwing GraphQL request layer`.

---

### Task 4: Language context

**Files:** Create `src/client/i18n/LanguageContext.tsx`, `src/client/i18n/languages.utils.ts`,
`tests/support/renderWithProviders.tsx`, `tests/client/i18n/LanguageContext.test.tsx`,
`tests/client/i18n/languages.utils.test.ts`.

**Interfaces:**
- `LanguageProvider({ children, initialLang? })`, `useLanguage(): { lang, setLang }`
- `otherLanguages(current, languages)`, `formatMonth(iso, lang)`
- `renderWithProviders(ui, { lang? })`

- [ ] **Step 1: Branch + deps** — `git checkout -b frontend/4-language && bun add date-fns`
- [ ] **Step 2: Failing utils test** — `tests/client/i18n/languages.utils.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatMonth, otherLanguages } from '@/client/i18n/languages.utils'

describe('otherLanguages', () => {
  it('lists every language except the current one', () => {
    const languages = [
      { code: 'FR', label: 'Français' },
      { code: 'EN', label: 'Anglais' },
    ] as const

    expect(otherLanguages('FR', languages)).toEqual([{ code: 'EN', label: 'Anglais' }])
  })
})

describe('formatMonth', () => {
  it('formats as MM/yyyy in French', () => {
    expect(formatMonth('2018-01-01', 'FR')).toBe('01/2018')
  })

  it('formats as MMM yyyy in English', () => {
    expect(formatMonth('2018-01-01', 'EN')).toBe('Jan 2018')
  })
})
```

- [ ] **Step 3: Implement utils** — `src/client/i18n/languages.utils.ts`:

```ts
import { format, parseISO } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import type { Lang, SiteLanguage } from '@/client/api/types'

export const otherLanguages = (
  current: Lang,
  languages: ReadonlyArray<SiteLanguage>,
): ReadonlyArray<SiteLanguage> => languages.filter(({ code }) => code !== current)

const MONTH_FORMATS = {
  FR: { pattern: 'MM/yyyy', locale: fr },
  EN: { pattern: 'MMM yyyy', locale: enUS },
} as const

export const formatMonth = (iso: string, lang: Lang): string => {
  const { pattern, locale } = MONTH_FORMATS[lang]
  return format(parseISO(iso), pattern, { locale })
}
```

- [ ] **Step 4: Failing context test** — `tests/client/i18n/LanguageContext.test.tsx`:

```tsx
import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageProvider, useLanguage } from '@/client/i18n/LanguageContext'
import { renderWithProviders } from '../../support/renderWithProviders'

const Probe = () => {
  const { lang, setLang } = useLanguage()
  return (
    <button type="button" onClick={() => { setLang('EN') }}>
      {lang}
    </button>
  )
}

describe('LanguageContext', () => {
  it('defaults to French and syncs the document language', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'fr')
  })

  it('respects initialLang', () => {
    renderWithProviders(<Probe />, { lang: 'EN' })

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
  })

  it('switches language for every consumer', async () => {
    renderWithProviders(<Probe />)

    await userEvent.click(screen.getByRole('button', { name: 'FR' }))

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })

  it('throws outside the provider', () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      'useLanguage must be used inside <LanguageProvider>',
    )
  })
})
```

(`bun add -d @testing-library/user-event` in this step: the frontend guidelines list it.)

- [ ] **Step 5: Implement context and render helper**

`src/client/i18n/LanguageContext.tsx`:

```tsx
import { createContext, type ReactNode, use, useEffect, useMemo, useState } from 'react'
import type { Lang } from '@/client/api/types'

type LanguageContextValue = Readonly<{
  lang: Lang
  setLang: (lang: Lang) => void
}>

export type LanguageProviderProps = Readonly<{ children: ReactNode; initialLang?: Lang }>

const LanguageContext = createContext<LanguageContextValue | null>(null)

export const LanguageProvider = ({ children, initialLang = 'FR' }: LanguageProviderProps) => {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang.toLowerCase())
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang])

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export const useLanguage = (): LanguageContextValue => {
  const value = use(LanguageContext)
  if (value === null) {
    throw new Error('useLanguage must be used inside <LanguageProvider>')
  }
  return value
}
```

`tests/support/renderWithProviders.tsx`:

```tsx
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { Lang } from '@/client/api/types'
import { LanguageProvider } from '@/client/i18n/LanguageContext'

export const renderWithProviders = (
  ui: ReactElement,
  { lang = 'FR' }: Readonly<{ lang?: Lang }> = {},
) => render(<LanguageProvider initialLang={lang}>{ui}</LanguageProvider>)
```

- [ ] **Step 6: Verify + commit** — `bun run verify`; commit
  `feat: add the language context and date formatting`.

---

### Task 5: `useResumePage`

**Files:** Create `src/client/hooks/useResumePage.ts`, `tests/client/hooks/useResumePage.test.tsx`.

**Interfaces:** `useResumePage(lang: Lang): ResumePageState` (spec §3.4).

- [ ] **Step 1: Branch** — `git checkout -b frontend/5-use-resume-page`
- [ ] **Step 2: Failing test** — `tests/client/hooks/useResumePage.test.tsx`:

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { delay, graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import type { Lang } from '@/client/api/types'
import { useResumePage } from '@/client/hooks/useResumePage'
import { resumePageFixture } from '../../support/fixtures'
import { server } from '../../support/server'

const aboutTitle = (lang: Lang) => resumePageFixture(lang).translations.sections.about

describe('useResumePage', () => {
  it('goes from loading to success', async () => {
    const { result } = renderHook(() => useResumePage('FR'))

    expect(result.current.status).toBe('loading')
    await waitFor(() => {
      expect(result.current).toMatchObject({
        status: 'success',
        data: { translations: { sections: { about: aboutTitle('FR') } } },
      })
    })
  })

  it.each([
    ['network', () => HttpResponse.error(), { kind: 'network' }],
    ['HTTP 500', () => HttpResponse.json({}, { status: 500 }), { kind: 'http', status: 500 }],
    [
      'GraphQL errors',
      () => HttpResponse.json({ errors: [{ message: 'boom' }] }),
      { kind: 'graphql', messages: ['boom'] },
    ],
  ] as const)('reports a %s failure', async (_name, resolver, error) => {
    server.use(graphql.query('ResumePage', resolver))
    const { result } = renderHook(() => useResumePage('FR'))

    await waitFor(() => {
      expect(result.current).toMatchObject({ status: 'error', error })
    })
  })

  it('refetches on retry', async () => {
    server.use(graphql.query('ResumePage', () => HttpResponse.error(), { once: true }))
    const { result } = renderHook(() => useResumePage('EN'))
    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    if (result.current.status === 'error') {
      result.current.retry()
    }

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })
  })

  it('keeps the latest language when responses arrive out of order', async () => {
    const delays: Readonly<Record<Lang, number>> = { FR: 10, EN: 200 }
    server.use(
      graphql.query<object, { lang: Lang }>('ResumePage', async ({ variables }) => {
        await delay(delays[variables.lang])
        return HttpResponse.json({ data: resumePageFixture(variables.lang) })
      }),
    )
    const { result, rerender } = renderHook(({ lang }) => useResumePage(lang), {
      initialProps: { lang: 'FR' as Lang },
    })

    rerender({ lang: 'EN' })
    rerender({ lang: 'FR' })

    await waitFor(() => {
      expect(result.current).toMatchObject({
        status: 'success',
        data: { translations: { sections: { about: aboutTitle('FR') } } },
      })
    })
    await delay(250)
    expect(result.current).toMatchObject({
      data: { translations: { sections: { about: aboutTitle('FR') } } },
    })
  })
})
```

- [ ] **Step 3: Implement** — `src/client/hooks/useResumePage.ts`:

```ts
import { useCallback, useEffect, useState } from 'react'
import { ResumePageDocument } from '@/client/api/documents'
import { request } from '@/client/api/graphql'
import type { ApiError } from '@/client/api/graphql.utils'
import type { Lang, ResumePageQuery } from '@/client/api/types'

export type ResumePageState =
  | Readonly<{ status: 'loading' }>
  | Readonly<{ status: 'error'; error: ApiError; retry: () => void }>
  | Readonly<{ status: 'success'; data: ResumePageQuery }>

type Settled =
  | Readonly<{ key: string; data: ResumePageQuery }>
  | Readonly<{ key: string; error: ApiError }>

// State belongs to one request key (language + attempt), so a stale response can never show:
// the derived status is `loading` until the current key settles.
export const useResumePage = (lang: Lang): ResumePageState => {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled | null>(null)
  const key = `${lang}#${String(attempt)}`

  useEffect(() => {
    const controller = new AbortController()
    void request(ResumePageDocument, { lang }, controller.signal).then((result) => {
      if (result.ok) {
        setSettled({ key, data: result.value })
      } else if (result.error.kind !== 'aborted') {
        setSettled({ key, error: result.error })
      }
    })
    return () => {
      controller.abort()
    }
  }, [key, lang])

  const retry = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  if (settled?.key !== key) {
    return { status: 'loading' }
  }
  return 'data' in settled
    ? { status: 'success', data: settled.data }
    : { status: 'error', error: settled.error, retry }
}
```

- [ ] **Step 4: Verify + commit** — `bun run verify`; commit
  `feat: add useResumePage with abort and stale-response protection`.

---

### Task 6: Theme, shell, SectionTitle, Loading, LoadError

**Files:** Create `src/client/styles/theme.css`, `public/favicon.ico` (moved from
`legacy/src/favicon.ico`), `src/client/components/{SectionTitle,Loading,LoadError}/*` + tests;
modify `index.html`, `src/client/main.tsx`, `eslint.config.ts`.

**Interfaces:** `SectionTitle({ text })`, `Loading({ lang })`, `LoadError({ lang, retry })`.

- [ ] **Step 1: Branch + deps** —
  `git checkout -b frontend/6-theme-shell && bun add react-icons @fontsource/josefin-sans`
- [ ] **Step 2: Theme** — `src/client/styles/theme.css`:

```css
@import '@fontsource/josefin-sans/300.css';
@import '@fontsource/josefin-sans/400.css';
@import '@fontsource/josefin-sans/700.css';

/* legacy/src/styles/_variables.scss and timeline.scss */
:root {
  --color-accent: #7cb5ec;
  --color-accent-dark: #3d93e3;
  --color-timeline: #7cb5ec;
  --color-muted: lightgray;
  --color-top-menu: black;
  --color-panel: #fff;
  --font-main: 'Josefin Sans', sans-serif;
}

/* legacy/src/styles/homePage.scss (base) */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  font-weight: 300;
}

a {
  text-decoration: none;
}

h5 {
  font-size: 20pt;
  font-style: italic;
}
```

(`--color-accent-dark` is `darken(#7CB5EC, 15%)`, used by the header icons' hover.)

- [ ] **Step 3: Shell** — `git mv legacy/src/favicon.ico public/favicon.ico`; in `index.html`
  add `<link rel="icon" href="/favicon.ico" />` in `<head>`; in `src/client/main.tsx` add
  `import '@/client/styles/theme.css'` as the first import and wrap `<App />` in
  `<LanguageProvider>`.

- [ ] **Step 4: Failing component tests**

`tests/client/components/SectionTitle/SectionTitle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'

describe('SectionTitle', () => {
  it('renders a level-2 heading', () => {
    render(<SectionTitle text="Skills" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument()
  })
})
```

`tests/client/components/Loading/Loading.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from '@/client/components/Loading/Loading'

describe('Loading', () => {
  it.each([
    ['FR', 'Chargement'],
    ['EN', 'Loading'],
  ] as const)('is a busy status labelled in %s', (lang, label) => {
    render(<Loading lang={lang} />)

    expect(screen.getByRole('status', { name: label })).toHaveAttribute('aria-busy', 'true')
  })
})
```

`tests/client/components/LoadError/LoadError.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoadError } from '@/client/components/LoadError/LoadError'

describe('LoadError', () => {
  it.each([
    ['FR', 'Réessayer'],
    ['EN', 'Retry'],
  ] as const)('retries from a button labelled in %s', async (lang, label) => {
    const retry = vi.fn()
    render(<LoadError lang={lang} retry={retry} />)

    await userEvent.click(screen.getByRole('button', { name: label }))

    expect(retry).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 5: Implement**

`src/client/components/SectionTitle/SectionTitle.tsx`:

```tsx
import styles from './SectionTitle.module.css'

export type SectionTitleProps = Readonly<{ text: string }>

export const SectionTitle = ({ text }: SectionTitleProps) => (
  <h2 className={styles.title}>{text}</h2>
)
```

`SectionTitle.module.css` (from `components/subSection.scss`):

```css
.title {
  margin: 10px;
  text-align: center;
}
```

`src/client/components/Loading/Loading.tsx`:

```tsx
import type { Lang } from '@/client/api/types'
import styles from './Loading.module.css'

// Shown before translations are loaded: documented jsx-no-literals exception
const LABELS: Readonly<Record<Lang, string>> = { FR: 'Chargement', EN: 'Loading' }

export type LoadingProps = Readonly<{ lang: Lang }>

export const Loading = ({ lang }: LoadingProps) => (
  <div role="status" aria-busy="true" aria-label={LABELS[lang]} className={styles.loading}>
    <span className={styles.spinner} />
  </div>
)
```

`Loading.module.css`:

```css
.loading {
  display: flex;
  justify-content: center;
  padding: 20vh 0;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-muted);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

`src/client/components/LoadError/LoadError.tsx`:

```tsx
import { FaRotateRight, FaTriangleExclamation } from 'react-icons/fa6'
import type { Lang } from '@/client/api/types'
import styles from './LoadError.module.css'

// Shown when translations failed to load: documented jsx-no-literals exception
const RETRY_LABELS: Readonly<Record<Lang, string>> = { FR: 'Réessayer', EN: 'Retry' }

export type LoadErrorProps = Readonly<{ lang: Lang; retry: () => void }>

export const LoadError = ({ lang, retry }: LoadErrorProps) => (
  <div role="alert" className={styles.error}>
    <FaTriangleExclamation aria-hidden className={styles.icon} />
    <button type="button" aria-label={RETRY_LABELS[lang]} className={styles.retry} onClick={retry}>
      <FaRotateRight aria-hidden />
    </button>
  </div>
)
```

`LoadError.module.css`:

```css
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20vh 0;
}

.icon {
  font-size: 3em;
  color: var(--color-accent);
}

.retry {
  padding: 10px 16px;
  font-size: 1.5em;
  color: var(--color-accent);
  background: transparent;
  border: 2px solid var(--color-accent);
  border-radius: 5px;
  cursor: pointer;
}
```

`eslint.config.ts` — after the components block:

```ts
  // Loading and LoadError render before translations exist: local FR/EN fallback labels
  // (docs/superpowers/specs/2026-09-21-frontend-migration-design.md §4)
  {
    files: [
      'src/client/components/Loading/Loading.tsx',
      'src/client/components/LoadError/LoadError.tsx',
    ],
    rules: { 'react/jsx-no-literals': 'off' },
  },
```

- [ ] **Step 6: Verify + commit** — `bun run verify`; `bun run build`; commit
  `feat: add the theme, favicon and loading/error states`.

---

### Task 7: Header

**Files:** Create `src/client/components/Header/{Header.tsx,Header.utils.ts,Flag.tsx,Header.module.css}`
+ `tests/client/components/Header/{Header.test.tsx,Header.utils.test.ts,Flag.test.tsx}`.

**Interfaces:** `Header({ profile, t, aria, languages })`, `Flag({ code })`,
`linkIcon(kind): IconType`.

- [ ] **Step 1: Branch** — `git checkout -b frontend/7-header`
- [ ] **Step 2: Failing tests**

`Header.utils.test.ts`:

```ts
// @vitest-environment node
import { FaCertificate, FaGithub, FaLinkedin } from 'react-icons/fa'
import { describe, expect, it } from 'vitest'
import { linkIcon } from '@/client/components/Header/Header.utils'

describe('linkIcon', () => {
  it.each([
    ['GITHUB', FaGithub],
    ['LINKEDIN', FaLinkedin],
    ['BADGES', FaCertificate],
  ] as const)('maps %s to its icon', (kind, icon) => {
    expect(linkIcon(kind)).toBe(icon)
  })
})
```

`Flag.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Flag } from '@/client/components/Header/Flag'

describe('Flag', () => {
  it.each(['FR', 'EN'] as const)('draws a decorative %s flag', (code) => {
    const { container } = render(<Flag code={code} />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
```

`Header.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Header } from '@/client/components/Header/Header'
import { useLanguage } from '@/client/i18n/LanguageContext'
import { resumePageFixture } from '../../../support/fixtures'
import { renderWithProviders } from '../../../support/renderWithProviders'

const CurrentLang = () => <output>{useLanguage().lang}</output>

const renderHeader = () => {
  const { resume, translations, siteLanguages } = resumePageFixture('FR')
  return renderWithProviders(
    <>
      <Header
        profile={resume.profile}
        t={translations.header}
        aria={translations.aria}
        languages={siteLanguages}
      />
      <CurrentLang />
    </>,
  )
}

describe('Header', () => {
  it('shows the profile', () => {
    renderHeader()

    expect(screen.getByText('Hugo Cantacuzene')).toBeInTheDocument()
    expect(screen.getByText('Architecte logiciel')).toBeInTheDocument()
    expect(screen.getByText('Schoelcher, Martinique')).toBeInTheDocument()
  })

  it('links to email and every profile', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Écrivez-moi !' })).toHaveAttribute(
      'href',
      'mailto:h.cantacuzene@gmail.com',
    )
    expect(screen.getByRole('link', { name: 'Mon profil GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/cantacuzene',
    )
    expect(screen.getByRole('link', { name: 'Mon profil LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voir mes badges' })).toBeInTheDocument()
  })

  it('offers only the other languages and switches to them', async () => {
    renderHeader()
    const switcher = screen.getByRole('group', { name: 'Changer de langue' })

    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Anglais' }))

    expect(switcher).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('EN')
  })
})
```

- [ ] **Step 3: Implement**

`Header.utils.ts`:

```ts
import type { IconType } from 'react-icons'
import { FaCertificate, FaGithub, FaLinkedin } from 'react-icons/fa'
import type { ProfileLink } from '@/client/api/types'

const LINK_ICONS: Readonly<Record<ProfileLink['kind'], IconType>> = {
  GITHUB: FaGithub,
  LINKEDIN: FaLinkedin,
  BADGES: FaCertificate,
}

export const linkIcon = (kind: ProfileLink['kind']): IconType => LINK_ICONS[kind]
```

`Flag.tsx` (FR tricolour; US flag simplified to stripes and canton, like the legacy `flag-icon-us`
at icon size):

```tsx
import type { Lang } from '@/client/api/types'

export type FlagProps = Readonly<{ code: Lang }>

export const Flag = ({ code }: FlagProps) =>
  code === 'FR' ? (
    <svg aria-hidden="true" viewBox="0 0 3 2" width="24" height="16">
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ed2939" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 19 10" width="24" height="16">
      <rect width="19" height="10" fill="#fff" />
      {[0, 2, 4, 6, 8].map((row) => (
        <rect key={row} y={(row * 10) / 13} width="19" height={10 / 13} fill="#b22234" />
      ))}
      {[10, 12].map((row) => (
        <rect key={row} y={(row * 10) / 13} width="19" height={10 / 13} fill="#b22234" />
      ))}
      <rect width="7.6" height={70 / 13} fill="#3c3b6e" />
    </svg>
  )
```

`Header.tsx`:

```tsx
import { FaEnvelope } from 'react-icons/fa'
import type { AriaLabels, HeaderLabels, Profile, SiteLanguage } from '@/client/api/types'
import { useLanguage } from '@/client/i18n/LanguageContext'
import { otherLanguages } from '@/client/i18n/languages.utils'
import { Flag } from './Flag'
import styles from './Header.module.css'
import { linkIcon } from './Header.utils'

export type HeaderProps = Readonly<{
  profile: Profile
  t: HeaderLabels
  aria: AriaLabels
  languages: ReadonlyArray<SiteLanguage>
}>

export const Header = ({ profile, t, aria, languages }: HeaderProps) => {
  const { lang, setLang } = useLanguage()

  return (
    <header>
      <div className={styles.topMenu}>
        <span>{t.switchTo}</span>
        <div role="group" aria-label={aria.switchLanguage} className={styles.switcher}>
          {otherLanguages(lang, languages).map(({ code, label }) => (
            <button
              key={code}
              type="button"
              aria-label={label}
              className={styles.flag}
              onClick={() => {
                setLang(code)
              }}
            >
              <Flag code={code} />
            </button>
          ))}
        </div>
      </div>
      <nav className={styles.nav}>
        <a className={`${styles.link ?? ''} ${styles.email ?? ''}`} href={`mailto:${profile.email}`}>
          <FaEnvelope aria-hidden className={styles.icon} />
          <span>{t.emailMe}</span>
        </a>
        {profile.links.map(({ kind, url, label }) => {
          const Icon = linkIcon(kind)
          return (
            <a
              key={kind}
              className={`${styles.link ?? ''} ${styles[kind.toLowerCase()] ?? ''}`}
              href={url}
            >
              <Icon aria-hidden className={styles.icon} />
              <span>{label}</span>
            </a>
          )
        })}
        <section className={styles.me}>
          <p>{profile.name}</p>
          <h5>{profile.jobTitle}</h5>
          <i className={styles.location}>{profile.location}</i>
        </section>
      </nav>
    </header>
  )
}
```

(The test's `<output>` has role `status`.)

`Header.module.css` translates `components/header.scss` and the `#me` rules of
`components/exp.scss`: `.topMenu` (black bar 40px, white text, `padding: 0 10px`,
`margin-bottom: 10px`), `.switcher` inline, `.flag` (no border/background, `filter: grayscale(100%)`,
`:hover` → `grayscale(0%)`), `.nav` (centred block; at `min-width: 700px` a grid
`15% 15% 1fr 15% 15%` with areas `email badges me github linkedin`), `.link`
(`display: inline-block`, width 60px, black, no underline, icon on its own line), `.icon`
(`font-size: 2em`, `:hover` color `var(--color-accent-dark)`), `.email`/`.badges`/`.github`/
`.linkedin`/`.me` (`grid-area`), `.me` (`font-size: 35pt`, centred, `margin: 10px`), `.location`
(`font-weight: 300`, lightgray, 17pt).

- [ ] **Step 4: Verify + commit** — `bun run verify`; commit `feat: port the header`.

---

### Task 8: About, Education and Timeline

**Files:** `src/client/components/{AboutMe,Education,Timeline}/*`
(`Timeline.tsx`, `TimelineItem.tsx`, `Timeline.utils.ts`) + tests.

**Interfaces:** `AboutMe({ about, title })`, `Education({ educations, title })`,
`Timeline({ experiences, title, t, lang })`, `TimelineItem({ experience, t, lang, side })`,
`sideOf(index): 'left' | 'right'`.

- [ ] **Step 1: Branch** — `git checkout -b frontend/8-sections`
- [ ] **Step 2: Failing tests**

`tests/client/components/AboutMe/AboutMe.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutMe } from '@/client/components/AboutMe/AboutMe'
import { resumePageFixture } from '../../../support/fixtures'

describe('AboutMe', () => {
  it('renders the cover and the interests', () => {
    const { resume } = resumePageFixture('EN')
    render(<AboutMe about={resume.about} title="About" />)

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText(resume.about.cover[0] ?? '')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(resume.about.interests.length)
  })
})
```

`tests/client/components/Education/Education.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Education } from '@/client/components/Education/Education'
import { resumePageFixture } from '../../../support/fixtures'

describe('Education', () => {
  it('renders each degree with its year, school and location', () => {
    const { resume } = resumePageFixture('EN')
    render(<Education educations={resume.educations} title="Education" />)

    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByText('Master: Expert in Information Technologies')).toBeInTheDocument()
    expect(screen.getByText('2008')).toBeInTheDocument()
    expect(screen.getAllByText('EPITECH')).toHaveLength(2)
    expect(screen.getAllByText('Paris, France')).toHaveLength(2)
  })
})
```

`tests/client/components/Timeline/Timeline.utils.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { sideOf } from '@/client/components/Timeline/Timeline.utils'

describe('sideOf', () => {
  it('alternates, starting on the right', () => {
    expect([0, 1, 2, 3].map(sideOf)).toEqual(['right', 'left', 'right', 'left'])
  })
})
```

`tests/client/components/Timeline/TimelineItem.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineItem } from '@/client/components/Timeline/TimelineItem'
import { resumePageFixture } from '../../../support/fixtures'

const { resume, translations } = resumePageFixture('FR')
const [current, previous] = resume.experiences

describe('TimelineItem', () => {
  it('shows the current position as ongoing', () => {
    if (current === undefined) throw new Error('fixture has no experience')
    render(<TimelineItem experience={current} t={translations.timeline} lang="FR" side="right" />)

    expect(screen.getByText('01/2018')).toBeInTheDocument()
    expect(screen.getByText("Aujourd'hui")).toBeInTheDocument()
    expect(screen.getByText('Architecte logiciel')).toBeInTheDocument()
    expect(screen.getByText('Karib IT SAS')).toBeInTheDocument()
  })

  it('shows the dates, description and stack under their labels', () => {
    if (previous === undefined) throw new Error('fixture has no experience')
    render(<TimelineItem experience={previous} t={translations.timeline} lang="FR" side="left" />)

    expect(screen.getByText('04/2015')).toBeInTheDocument()
    expect(screen.getByText('05/2017')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Descriptif' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Technologies' })).toBeInTheDocument()
    expect(screen.getByText(previous.stack.join(', '))).toBeInTheDocument()
  })
})
```

`tests/client/components/Timeline/Timeline.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Timeline } from '@/client/components/Timeline/Timeline'
import { resumePageFixture } from '../../../support/fixtures'

describe('Timeline', () => {
  it('renders every experience under the section title', () => {
    const { resume, translations } = resumePageFixture('EN')
    render(
      <Timeline
        experiences={resume.experiences}
        title="Experience"
        t={translations.timeline}
        lang="EN"
      />,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(resume.experiences.length)
    expect(screen.getByText('Present')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Implement**

`AboutMe.tsx`:

```tsx
import type { Resume } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './AboutMe.module.css'

export type AboutMeProps = Readonly<{ about: Resume['about']; title: string }>

export const AboutMe = ({ about, title }: AboutMeProps) => (
  <section className={styles.about}>
    <SectionTitle text={title} />
    {about.cover.map((paragraph) => (
      <p key={paragraph} className={styles.paragraph}>
        {paragraph}
      </p>
    ))}
    <ul className={styles.interests}>
      {about.interests.map((interest) => (
        <li key={interest}>{interest}</li>
      ))}
    </ul>
  </section>
)
```

`AboutMe.module.css` (`subSection.scss` `.sub` + `exp.scss` `.about ul`):

```css
.about {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.paragraph {
  margin-bottom: 1.2em;
}

.interests {
  padding: 30px;
}
```

`Education.tsx`:

```tsx
import type { Education as EducationEntry } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './Education.module.css'

export type EducationProps = Readonly<{
  educations: ReadonlyArray<EducationEntry>
  title: string
}>

export const Education = ({ educations, title }: EducationProps) => (
  <section className={styles.education}>
    <SectionTitle text={title} />
    {educations.map(({ id, year, school, title: degree, location }) => (
      <div key={id}>
        <div className={styles.school}>
          <span className={styles.year}>{year}</span>
          <span>{school}</span>
        </div>
        <div className={styles.degree}>
          <p>{degree}</p>
          <i className={styles.location}>{location}</i>
        </div>
      </div>
    ))}
  </section>
)
```

`Education.module.css` (`homePage.scss` `.school`, `.diplome`, `.grey`):

```css
.education {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.school {
  color: var(--color-accent);
  font-weight: bold;
}

.year {
  margin: 45px;
}

.degree {
  margin: 10px 0 10px 130px;
}

.location {
  color: var(--color-muted);
}
```

`Timeline.utils.ts`:

```ts
export type Side = 'left' | 'right'

// The legacy timeline starts on the right (`contentClassName: "right"` on the newest entry)
export const sideOf = (index: number): Side => (index % 2 === 0 ? 'right' : 'left')
```

`TimelineItem.tsx`:

```tsx
import type { Experience, Lang, TimelineLabels } from '@/client/api/types'
import { formatMonth } from '@/client/i18n/languages.utils'
import styles from './Timeline.module.css'
import type { Side } from './Timeline.utils'

export type TimelineItemProps = Readonly<{
  experience: Experience
  t: TimelineLabels
  lang: Lang
  side: Side
}>

export const TimelineItem = ({ experience, t, lang, side }: TimelineItemProps) => (
  <article className={styles.item}>
    <div className={styles.icon} />
    <div className={`${styles.content ?? ''} ${styles[side] ?? ''}`}>
      <h3 className={styles.heading}>
        <span className={styles.title}>{experience.title}</span>
        <span>{experience.company}</span>
        <span className={styles.dates}>
          <span className={styles.start}>{formatMonth(experience.start, lang)}</span>
          <span>{experience.end ? formatMonth(experience.end, lang) : t.present}</span>
        </span>
      </h3>
      <h4 className={styles.label}>{t.description}</h4>
      <p>{experience.description}</p>
      <h4 className={styles.label}>{t.stack}</h4>
      <p>{experience.stack.join(', ')}</p>
    </div>
  </article>
)
```

`Timeline.tsx`:

```tsx
import type { Experience, Lang, TimelineLabels } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './Timeline.module.css'
import { sideOf } from './Timeline.utils'
import { TimelineItem } from './TimelineItem'

export type TimelineProps = Readonly<{
  experiences: ReadonlyArray<Experience>
  title: string
  t: TimelineLabels
  lang: Lang
}>

export const Timeline = ({ experiences, title, t, lang }: TimelineProps) => (
  <section className={styles.experience}>
    <SectionTitle text={title} />
    <div className={styles.container}>
      <div className={styles.timeline}>
        {experiences.map((experience, index) => (
          <TimelineItem
            key={experience.id}
            experience={experience}
            t={t}
            lang={lang}
            side={sideOf(index)}
          />
        ))}
      </div>
    </div>
  </section>
)
```

`Timeline.module.css` translates `timeline.scss` (`#timeline`, `.timeline-item`,
`.timeline-icon`, `.timeline-content`, `.right`, the `max-width: 768px` media query; the
`.btn` rules are unused and dropped) and `exp.scss` `.experience`, with class names
`experience`, `container`, `timeline`, `item`, `icon`, `content`, `left`, `right`, `heading`
(the legacy `h2`, now `h3` because the section title is the `h2`), `dates` (the legacy
`.timeline-date`, `font-size: 10px`, on its own line), `label`, `title`, `start`. `$timeline-color`
is `var(--color-timeline)`. Punctuation from CSS:

```css
.title::after {
  content: ', ';
}

.dates {
  display: block;
  font-size: 10px;
}

.start::after {
  content: ' - ';
}

.label {
  margin-top: 15px;
}

.label::after {
  content: ':';
}
```

`.left` needs no rule besides the default arrow (content floats left); `.right` floats right with
the mirrored arrow, as in the legacy file.

- [ ] **Step 4: Verify + commit** — `bun run verify`; commit
  `feat: port the about, education and timeline sections`.

---

### Task 9: Charts

**Files:** `src/client/components/Skills/{Skills.tsx,Skills.utils.ts,Skills.module.css}`,
`src/client/components/Languages/{Languages.tsx,LanguageRing.tsx,Languages.utils.ts,Languages.module.css}`
+ tests.

**Interfaces:** `radarGeometry(skills, size)` (spec §5.1); `ringRadii(height)`,
`backgroundArc(radii)`, `progressArc(radii, rating)`, `formatPercent(rating)`;
`Skills({ skills, title })`, `Languages({ spokenLanguages, title })`,
`LanguageRing({ name, rating, height, x })`.

- [ ] **Step 1: Branch + deps** —
  `git checkout -b frontend/9-charts && bun add d3-scale d3-shape && bun add -d @types/d3-scale @types/d3-shape`
- [ ] **Step 2: Failing utils tests**

`tests/client/components/Skills/Skills.utils.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { radarGeometry } from '@/client/components/Skills/Skills.utils'

const skills = [
  { name: 'A', rating: 100 },
  { name: 'B', rating: 50 },
  { name: 'C', rating: 0 },
  { name: 'D', rating: 25 },
]

describe('radarGeometry', () => {
  const geometry = radarGeometry(skills, 200)

  it('places one axis per skill, clockwise from 12 o’clock, at 80% of the half size', () => {
    expect(geometry.center).toBe(100)
    expect(geometry.axes).toEqual([
      { x: 100, y: 20 },
      { x: 180, y: 100 },
      { x: 100, y: 180 },
      { x: 20, y: 100 },
    ])
  })

  it('draws four polygon rings', () => {
    expect(geometry.rings).toHaveLength(4)
    expect(geometry.rings[3]).toBe('100,20 180,100 100,180 20,100')
    expect(geometry.rings[1]).toBe('100,60 140,100 100,140 60,100')
  })

  it('draws the skill polygon and value points', () => {
    expect(geometry.polygon).toBe('100,20 140,100 100,100 80,100')
    expect(geometry.values.map(({ text }) => text)).toEqual(['A 100%', 'B 50%', 'C 0%', 'D 25%'])
  })

  it('anchors labels by side', () => {
    expect(geometry.labels.map(({ anchor }) => anchor)).toEqual([
      'middle',
      'start',
      'middle',
      'end',
    ])
    expect(geometry.labels[0]).toMatchObject({ x: 100, y: 8, text: 'A' })
  })
})
```

`tests/client/components/Languages/Languages.utils.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  backgroundArc,
  formatPercent,
  progressArc,
  ringRadii,
} from '@/client/components/Languages/Languages.utils'

describe('ringRadii', () => {
  it('keeps the legacy proportions', () => {
    expect(ringRadii(190)).toEqual({ outer: 85, inner: 65 })
  })
})

describe('arcs', () => {
  const radii = ringRadii(190)

  it('draws the background as a full ring', () => {
    expect(backgroundArc(radii)).toMatch(/^M0,-85A85,85/)
  })

  it('draws longer progress arcs for higher ratings', () => {
    expect(progressArc(radii, 0.5)).not.toBe(progressArc(radii, 1))
    expect(progressArc(radii, 0.5)).toMatch(/^M/)
  })
})

describe('formatPercent', () => {
  it('rounds to a whole percentage', () => {
    expect(formatPercent(0.87)).toBe('87%')
    expect(formatPercent(1)).toBe('100%')
  })
})
```

- [ ] **Step 3: Implement utils**

`Skills.utils.ts`:

```ts
import { scaleLinear } from 'd3-scale'
import type { Skill } from '@/client/api/types'

export type Point = Readonly<{ x: number; y: number }>
export type Label = Point & Readonly<{ anchor: 'start' | 'middle' | 'end'; text: string }>
export type RadarGeometry = Readonly<{
  center: number
  axes: ReadonlyArray<Point>
  rings: ReadonlyArray<string>
  polygon: string
  values: ReadonlyArray<Point & Readonly<{ text: string }>>
  labels: ReadonlyArray<Label>
}>

// legacy Highcharts options: pane.size 80%, polygon grid lines
const PANE_RATIO = 0.8
const RING_LEVELS: ReadonlyArray<number> = [25, 50, 75, 100]
const LABEL_OFFSET = 12
const VERTICAL_TOLERANCE = Math.PI / 18

const round = (value: number): number => Math.round(value * 100) / 100 + 0

const angleOf = (index: number, count: number): number => (2 * Math.PI * index) / count

const pointAt = (center: number, radius: number, angle: number): Point => ({
  x: round(center + radius * Math.sin(angle)),
  y: round(center - radius * Math.cos(angle)),
})

const toPoints = (points: ReadonlyArray<Point>): string =>
  points.map(({ x, y }) => `${String(x)},${String(y)}`).join(' ')

const anchorOf = (angle: number): Label['anchor'] => {
  const fromVertical = Math.min(angle % Math.PI, Math.PI - (angle % Math.PI))
  if (fromVertical < VERTICAL_TOLERANCE) {
    return 'middle'
  }
  return angle < Math.PI ? 'start' : 'end'
}

export const radarGeometry = (skills: ReadonlyArray<Skill>, size: number): RadarGeometry => {
  const center = size / 2
  const radius = center * PANE_RATIO
  const scale = scaleLinear().domain([0, 100]).range([0, radius])
  const angles = skills.map((_skill, index) => angleOf(index, skills.length))
  const valuePoints = skills.map((skill, index) =>
    pointAt(center, scale(skill.rating), angles[index] ?? 0),
  )

  return {
    center,
    axes: angles.map((angle) => pointAt(center, radius, angle)),
    rings: RING_LEVELS.map((level) =>
      toPoints(angles.map((angle) => pointAt(center, scale(level), angle))),
    ),
    polygon: toPoints(valuePoints),
    values: valuePoints.map((point, index) => ({
      ...point,
      text: `${skills[index]?.name ?? ''} ${String(skills[index]?.rating ?? 0)}%`,
    })),
    labels: angles.map((angle, index) => ({
      ...pointAt(center, radius + LABEL_OFFSET, angle),
      anchor: anchorOf(angle),
      text: skills[index]?.name ?? '',
    })),
  }
}
```

`Languages.utils.ts`:

```ts
import { arc } from 'd3-shape'

export type RingRadii = Readonly<{ outer: number; inner: number }>

// legacy/src/components/LanguageChart.utils.js
export const ringRadii = (height: number): RingRadii => {
  const outer = height / 2 - 10
  return { outer, inner: outer - 20 }
}

export const backgroundArc = ({ outer, inner }: RingRadii): string =>
  arc()({ innerRadius: inner, outerRadius: outer, startAngle: 0, endAngle: 2 * Math.PI }) ?? ''

export const progressArc = ({ outer, inner }: RingRadii, rating: number): string =>
  arc().cornerRadius(20)({
    innerRadius: inner,
    outerRadius: outer,
    startAngle: -0.05,
    endAngle: 2 * Math.PI * rating,
  }) ?? ''

export const formatPercent = (rating: number): string => `${String(Math.round(rating * 100))}%`
```

- [ ] **Step 4: Failing component tests**

`tests/client/components/Skills/Skills.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skills } from '@/client/components/Skills/Skills'
import { resumePageFixture } from '../../../support/fixtures'

describe('Skills', () => {
  it('draws a radar chart titled with the section title', () => {
    const { resume } = resumePageFixture('EN')
    render(<Skills skills={resume.skills} title="Skills" />)

    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByText('C# 90%')).toBeInTheDocument()
    expect(screen.getByText('Web Architecture')).toBeInTheDocument()
  })
})
```

`tests/client/components/Languages/LanguageRing.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LanguageRing } from '@/client/components/Languages/LanguageRing'

describe('LanguageRing', () => {
  it('labels the ring with the language and its percentage', () => {
    render(
      <svg>
        <LanguageRing name="English" rating={0.87} height={190} x={125} />
      </svg>,
    )

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('87%')).toBeInTheDocument()
  })
})
```

`tests/client/components/Languages/Languages.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Languages } from '@/client/components/Languages/Languages'
import { resumePageFixture } from '../../../support/fixtures'

describe('Languages', () => {
  it('draws one ring per spoken language', () => {
    const { resume } = resumePageFixture('FR')
    render(<Languages spokenLanguages={resume.spokenLanguages} title="Langues" />)

    expect(screen.getByRole('img', { name: 'Langues' })).toBeInTheDocument()
    expect(screen.getByText('Anglais')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Implement components**

`Skills.tsx`:

```tsx
import { useId } from 'react'
import type { Skill } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './Skills.module.css'
import { radarGeometry } from './Skills.utils'

const SIZE = 400

export type SkillsProps = Readonly<{ skills: ReadonlyArray<Skill>; title: string }>

export const Skills = ({ skills, title }: SkillsProps) => {
  const titleId = useId()
  const { center, axes, rings, polygon, values, labels } = radarGeometry(skills, SIZE)

  return (
    <section className={styles.skills}>
      <SectionTitle text={title} />
      <svg
        role="img"
        aria-labelledby={titleId}
        viewBox={`0 0 ${String(SIZE)} ${String(SIZE)}`}
        className={styles.chart}
      >
        <title id={titleId}>{title}</title>
        {rings.map((points) => (
          <polygon key={points} points={points} className={styles.ring} />
        ))}
        {axes.map(({ x, y }) => (
          <line key={`${String(x)},${String(y)}`} x1={center} y1={center} x2={x} y2={y} className={styles.axis} />
        ))}
        <polygon points={polygon} className={styles.values} />
        {values.map(({ x, y, text }) => (
          <circle key={text} cx={x} cy={y} r={4} className={styles.point}>
            <title>{text}</title>
          </circle>
        ))}
        {labels.map(({ x, y, anchor, text }) => (
          <text key={text} x={x} y={y} textAnchor={anchor} className={styles.label}>
            {text}
          </text>
        ))}
      </svg>
    </section>
  )
}
```

`Skills.module.css` (legacy Highcharts look: blue line, grey polygon grid):

```css
.skills {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.chart {
  display: block;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: visible;
}

.ring {
  fill: none;
  stroke: #e6e6e6;
}

.axis {
  stroke: #e6e6e6;
}

.values {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 2;
}

.point {
  fill: var(--color-accent);
}

.label {
  font-size: 11px;
  fill: #666;
  dominant-baseline: middle;
}
```

`LanguageRing.tsx`:

```tsx
import { useId } from 'react'
import styles from './Languages.module.css'
import { backgroundArc, formatPercent, progressArc, ringRadii } from './Languages.utils'

export type LanguageRingProps = Readonly<{
  name: string
  rating: number
  height: number
  x: number
}>

// legacy/src/components/LanguageChart.utils.js: rings with inset shadows
export const LanguageRing = ({ name, rating, height, x }: LanguageRingProps) => {
  const shadowId = useId()
  const radii = ringRadii(height)

  return (
    <g transform={`translate(${String(x)}, ${String(height / 2)})`}>
      <defs>
        <filter id={`${shadowId}-outer`}>
          <feOffset dx="0" dy="0" />
          <feGaussianBlur stdDeviation="5" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="grey" floodOpacity="0.5" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
        <filter id={`${shadowId}-inner`}>
          <feOffset dx="0" dy="0" />
          <feGaussianBlur stdDeviation="1" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="white" floodOpacity="0.5" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
      <path d={backgroundArc(radii)} className={styles.track} filter={`url(#${shadowId}-outer)`} />
      <path
        d={progressArc(radii, rating)}
        className={styles.progress}
        filter={`url(#${shadowId}-inner)`}
      />
      <circle r={radii.inner} className={styles.centre} />
      <text textAnchor="middle" className={styles.name}>
        {name}
      </text>
      <text textAnchor="middle" dy="30" className={styles.percent}>
        {formatPercent(rating)}
      </text>
    </g>
  )
}
```

`Languages.tsx`:

```tsx
import { useId } from 'react'
import type { SpokenLanguage } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import { LanguageRing } from './LanguageRing'
import styles from './Languages.module.css'

// legacy LanguageList: a 500 × 190 SVG, rings centred at x = 125 and 333
const WIDTH = 500
const HEIGHT = 190
const RING_SPACING = 208
const FIRST_RING_X = 125

export type LanguagesProps = Readonly<{
  spokenLanguages: ReadonlyArray<SpokenLanguage>
  title: string
}>

export const Languages = ({ spokenLanguages, title }: LanguagesProps) => {
  const titleId = useId()

  return (
    <section className={styles.languages}>
      <SectionTitle text={title} />
      <svg
        role="img"
        aria-labelledby={titleId}
        viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
        className={styles.chart}
      >
        <title id={titleId}>{title}</title>
        {spokenLanguages.map(({ name, rating }, index) => (
          <LanguageRing
            key={name}
            name={name}
            rating={rating}
            height={HEIGHT}
            x={FIRST_RING_X + index * RING_SPACING}
          />
        ))}
      </svg>
    </section>
  )
}
```

`Languages.module.css` (legacy `languageChartStyle` colors, `.svgContainerWebChart` sizing):

```css
.languages {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.chart {
  width: 100%;
  max-width: 600px;
}

.track {
  fill: #ccc;
}

.progress {
  fill: #67baf5;
}

.centre {
  fill: #fff;
}

.name {
  font-size: 35px;
  fill: #ccc;
}

.percent {
  font-size: 20px;
  fill: #ccc;
}
```

- [ ] **Step 6: Verify + commit** — `bun run verify`; commit `feat: draw the skills radar and language rings`.

---

### Task 10: HomePage and App

**Files:** `src/client/components/HomePage/{HomePage.tsx,HomePage.module.css}`,
`src/client/App.tsx`, tests `tests/client/components/HomePage/HomePage.test.tsx`,
`tests/client/App.test.tsx`.

- [ ] **Step 1: Branch** — `git checkout -b frontend/10-app`
- [ ] **Step 2: Failing tests**

`tests/client/components/HomePage/HomePage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from '@/client/components/HomePage/HomePage'
import { resumePageFixture } from '../../../support/fixtures'

describe('HomePage', () => {
  it('renders the five sections in the legacy order', () => {
    const { resume, translations } = resumePageFixture('EN')
    render(
      <HomePage resume={resume} t={translations.sections} timeline={translations.timeline} lang="EN" />,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['About', 'Skills', 'Education', 'Languages', 'Experience'])
  })
})
```

`tests/client/App.test.tsx` (replaces the scaffold test):

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { App } from '@/client/App'
import { renderWithProviders } from '../support/renderWithProviders'
import { server } from '../support/server'

describe('App', () => {
  it('loads the resume in French', async () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('status', { name: 'Chargement' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'À propos' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(5)
  })

  it('switches everything to English', async () => {
    renderWithProviders(<App />)

    await userEvent.click(await screen.findByRole('button', { name: 'Anglais' }))

    expect(await screen.findByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(screen.getByRole('button', { name: 'French' })).toBeInTheDocument()
  })

  it('recovers from a failed load', async () => {
    server.use(
      graphql.query('ResumePage', () => HttpResponse.json({}, { status: 500 }), { once: true }),
    )
    renderWithProviders(<App />)

    await userEvent.click(await screen.findByRole('button', { name: 'Réessayer' }))

    expect(await screen.findByRole('heading', { name: 'À propos' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Implement**

`HomePage.tsx`:

```tsx
import type { Lang, Resume, SectionTitles, TimelineLabels } from '@/client/api/types'
import { AboutMe } from '@/client/components/AboutMe/AboutMe'
import { Education } from '@/client/components/Education/Education'
import { Languages } from '@/client/components/Languages/Languages'
import { Skills } from '@/client/components/Skills/Skills'
import { Timeline } from '@/client/components/Timeline/Timeline'
import styles from './HomePage.module.css'

export type HomePageProps = Readonly<{
  resume: Resume
  t: SectionTitles
  timeline: TimelineLabels
  lang: Lang
}>

export const HomePage = ({ resume, t, timeline, lang }: HomePageProps) => (
  <main className={styles.main}>
    <div className={styles.about}>
      <AboutMe about={resume.about} title={t.about} />
    </div>
    <div className={styles.skills}>
      <Skills skills={resume.skills} title={t.skills} />
    </div>
    <div className={styles.education}>
      <Education educations={resume.educations} title={t.education} />
    </div>
    <div className={styles.languages}>
      <Languages spokenLanguages={resume.spokenLanguages} title={t.languages} />
    </div>
    <div className={styles.experience}>
      <Timeline experiences={resume.experiences} title={t.experiences} t={timeline} lang={lang} />
    </div>
  </main>
)
```

`HomePage.module.css` translates `components/content-layout.scss` and `homePage.scss` `#main`:
at `min-width: 700px`, `.main` is a grid `40% 5% 55%` with the about / skills / education /
languages cells in column 1 (rows 1–4) and `.experience` in column 3 spanning rows 1–4
(`overflow: visible`). The legacy fixed row heights (`900px 500px 300px 2000px` and their
per-breakpoint variants) become `grid-template-rows: auto auto auto 1fr`, because the ported
sections size themselves; this is the one intentional layout difference, noted in the PR.

`App.tsx`:

```tsx
import { Header } from '@/client/components/Header/Header'
import { HomePage } from '@/client/components/HomePage/HomePage'
import { LoadError } from '@/client/components/LoadError/LoadError'
import { Loading } from '@/client/components/Loading/Loading'
import { useResumePage } from '@/client/hooks/useResumePage'
import { useLanguage } from '@/client/i18n/LanguageContext'

export const App = () => {
  const { lang } = useLanguage()
  const state = useResumePage(lang)

  if (state.status === 'loading') {
    return <Loading lang={lang} />
  }
  if (state.status === 'error') {
    return <LoadError lang={lang} retry={state.retry} />
  }

  const { resume, translations, siteLanguages } = state.data
  return (
    <>
      <Header
        profile={resume.profile}
        t={translations.header}
        aria={translations.aria}
        languages={siteLanguages}
      />
      <HomePage
        resume={resume}
        t={translations.sections}
        timeline={translations.timeline}
        lang={lang}
      />
    </>
  )
}
```

- [ ] **Step 4: Verify** — `bun run verify`; `bun run build`. Manual check: `bun run dev:server`
  and `bun run dev`, open `http://localhost:5173`, switch languages, compare with the legacy
  stylesheets.
- [ ] **Step 5: Commit** — `feat: assemble the resume page`.

---

### Task 11: Remove the legacy app and update the docs

**Files:** Delete `legacy/`; modify `eslint.config.ts`, `.prettierignore`,
`docs/guidelines/frontend.md`, `CLAUDE.md`.

- [ ] **Step 1: Branch** — `git checkout -b frontend/11-remove-legacy`
- [ ] **Step 2: Delete** — `git rm -rq legacy`; remove `'legacy/**'` from `globalIgnores` in
  `eslint.config.ts`, the `legacy/` line from `.prettierignore`, and the "ignores the legacy
  folder" test in `tests/lint/common.test.ts` (the folder no longer exists; keep the
  `.superpowers/` one).
- [ ] **Step 3: `frontend.md`** — add to §1 (Components):
  - `- Styles are CSS Modules next to their component (\`X.module.css\`); shared values are custom properties in \`src/client/styles/theme.css\`. Punctuation between translated values comes from CSS \`::before\` / \`::after\`.`
  - `- Icons come from \`react-icons\`; fonts are self-hosted with \`@fontsource\`. No runtime CDN.`
  - `- Charts are JSX SVG; their geometry lives in a pure, tested \`*.utils.ts\`.`

  and to §2: `- The GraphQL URL comes from \`VITE_GRAPHQL_URL\` (default \`http://localhost:4000/graphql\`), resolved in \`src/client/api/graphql.utils.ts\`. The client never imports \`src/server/\`.`
  and add the enforcement row
  `| Client never imports the server | \`no-restricted-imports\` (\`@/server/*\`) scoped to \`src/client/**\` |`.
- [ ] **Step 4: `CLAUDE.md`** — replace the "Migration in progress…" paragraph with
  `Personal resume: React frontend in \`src/client/\`, Bun + GraphQL API in \`src/server/\`.`;
  add under Commands `- Run \`bun run dev:server\` and \`bun run dev\` together for local development`;
  add under Server environment a "Frontend environment" list:
  `- \`VITE_GRAPHQL_URL\`: GraphQL endpoint, default \`http://localhost:4000/graphql\``.
- [ ] **Step 5: Verify + commit** — `grep -rn "legacy" --exclude-dir=node_modules --exclude-dir=docs . | grep -v "^./bun.lock"`
  shows nothing that needs the folder; `bun run verify`; commit
  `chore: remove the legacy app and document the finished frontend`.
