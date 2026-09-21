# Common Guidelines

These rules apply to all TypeScript code in this repository, frontend and backend.
[`frontend.md`](frontend.md) and [`backend.md`](backend.md) add rules specific to each side.

Every rule is enforced by tooling (see [Enforcement](#5-enforcement)); a rule that cannot be
enforced automatically is marked **(review)**.

## 1. TypeScript & formatting

- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.
- No `any`. Use `unknown` and narrow. `as` casts are allowed only at trust boundaries (I/O
  layers), each with a justifying comment **(review)**.
- **No semicolons.** Single quotes, trailing commas, 100-column lines, 2-space indent.
- Use `type` aliases, not `interface`.
- Named exports only; no default exports (tool config files excepted).
- The GraphQL schema is the single source of truth for data shapes shared between frontend and
  backend. Types derived from it are generated, never written by hand.

## 2. Functional style

- **Pure by default.** Functions depend only on their arguments; no module-level mutable state.
- **Immutability:** `const` only; no mutation of arrays or objects; `Readonly<…>` /
  `ReadonlyArray<…>` for data types.
- No `for`/`while` loops — use `map`/`filter`/`reduce` or Ramda.
- No classes, no `this`.
- **Ramda** is the library for data transformation, composed with `pipe()`, typed via
  `types-ramda`. A pipeline that cannot be typed without `any` is rewritten as plain code.
- **Errors are values.** I/O layers return a `Result<T, E>` union (`src/shared/result.ts`) and
  never throw.

## 3. Side effects

- **I/O lives at the edges.** Network, file-system and environment access are confined to
  dedicated modules (listed in each side's guidelines); everything else is pure **(review)**.
- Data crossing a trust boundary (HTTP responses, request inputs, files) is validated where it
  enters.
- `src/shared/` is runtime-neutral: no React, DOM, Bun or Node APIs, and no imports from
  `src/client/` or `src/server/`.

## 4. Testing

- Tests live in `tests/`, **outside `src/`**, mirroring its structure. Shared helpers and fixtures
  live in `tests/support/`.
- Tests import sources through the `@/` alias.
- **Mock only at the edges** (network, third-party code that cannot run in the test environment).
  Never mock own modules.
- **No snapshot tests.** Assert on behaviour and output.
- Pure functions are tested as input → output.
- Fixtures are typed with the generated schema types.
- One `describe` per unit; `it` names the behaviour; arrange / act / assert; no shared mutable
  state between tests **(review)**.
- **Coverage ≥ 90% lines and branches** over `src/`, excluding entry points and generated code.

## 5. Enforcement

| Rule | Tool |
|---|---|
| Formatting, no semicolons | Prettier (`semi: false`, `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100`) |
| Strict types, no `any` | `tsc --noEmit` + `typescript-eslint` `strict-type-checked` |
| Immutability, no loops, no classes, no `this` | `eslint-plugin-functional`: `no-let`, `immutable-data`, `no-loop-statements`, `no-classes`, `no-this-expressions`, `prefer-immutable-types` |
| Named exports only | `import/no-default-export` (config files overridden) |
| No snapshots, no mocking own modules | `no-restricted-syntax` banning `toMatchSnapshot` and mocks of `@/…` — scoped to `tests/**` |
| Coverage ≥ 90% | test runner coverage thresholds |
| `src/shared/` is runtime-neutral | `no-restricted-imports`, `no-restricted-globals` scoped to `src/shared/**` |
| Generated types up to date | regenerate + `git diff --exit-code` |

- ESLint runs with `--max-warnings 0`.
- All checks are aggregated in a single `verify` script.
- `verify` runs on **pre-commit** (Lefthook, after auto-fixing staged files) and in **CI**; a
  failure rejects the commit or blocks the merge.
