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
- `vitest.config.ts` runs every package that imports `graphql` through Vite
  (`server.deps.inline`): graphql ships a separate development build, and loading two copies
  breaks schema checks ("GraphQLSchema from another module or realm").
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
