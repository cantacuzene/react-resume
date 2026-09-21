# Frontend Guidelines (React)

These rules apply to the React frontend (`src/client/`), **in addition to**
[`common.md`](common.md).

## 1. Components

- **Function components only.** No class components.
- Components are **arrow constants** with destructured, typed props:
  ```tsx
  type UserCardProps = Readonly<{ name: string; tags: ReadonlyArray<string> }>

  export const UserCard = ({ name, tags }: UserCardProps) => { … }
  ```
- The props type is named `<Component>Props` and is `Readonly<…>`.
- One component per file, named after the component in PascalCase **(review)**.
- No `PropTypes`, no `React.FC`.
- **Components render; they do not transform data.** Data shaping lives in pure functions in a
  `<Component>.utils.ts` file next to the component **(review)**.
- A component may call a composed function, but a component is never itself the output of
  `pipe`/`curry`/HOC composition **(review)**.
- A component's output depends only on its props and the context it reads; no side effects during
  render.

- Styles are CSS Modules next to their component (`X.module.css`); shared values are custom
  properties in `src/client/styles/theme.css`. Punctuation between translated values comes from
  CSS `::before` / `::after`, never from JSX text.
- Icons come from `react-icons`; fonts are self-hosted with `@fontsource`. No runtime CDN.
- Charts are JSX SVG; their geometry lives in a pure, tested `*.utils.ts`.

## 2. State & side effects

- **State is the exception.** It may live only in:
  1. **context providers** holding app-wide state;
  2. **data hooks** holding request status.

  The design spec of each feature lists which providers and hooks exist. Any other
  `useState`/`useReducer` requires a comment explaining why **(review)**.
- **Request status is one discriminated union** (`loading | error | success`), never a set of
  booleans.
- **Derived values are computed during render** with pure functions, never copied into state.
- **Data hooks cancel stale requests** (`AbortController`) when their inputs change.
- `fetch` is called only in `src/client/api/`. `useEffect` is used only in data hooks, context providers
  and third-party integration code **(review)**.
- Context is consumed only through a dedicated `useX()` hook that throws outside its provider.
- Prefer props over context: only components that need to *change* shared state or are far from
  its source read context directly **(review)**.

- The GraphQL URL comes from `VITE_GRAPHQL_URL` (default `http://localhost:4000/graphql`),
  resolved in `src/client/api/graphql.utils.ts`. The client never imports `src/server/`; it
  talks to the API over GraphQL only, with types generated into `src/client/gql/`.

## 3. Text & accessibility

- **No hard-coded user-visible strings.** All text comes from translations. Any exception is
  documented in the design spec and scoped to a single file in the lint config.
- Interactive elements are real `<button>` / `<a href>` — never `<a href="#">` or clickable `<div>`.
- Decorative icons carry `aria-hidden`; icon-only controls carry an `aria-label`.
- The document `lang` attribute follows the current UI language.

## 4. Testing

- Vitest (jsdom), React Testing Library, `@testing-library/user-event`,
  `@testing-library/jest-dom`, MSW for the network (unhandled requests fail the test).
- Every component (`src/client/**/*.tsx`) and every utils file (`src/client/**/*.utils.ts`) has a
  matching `tests/client/**/*.test.ts(x)`. Entry points and generated code are exempt.
- **Query priority:** `getByRole` > `getByLabelText` > `getByText`. `getByTestId` is banned.
- Third-party renderers that cannot run in jsdom are replaced with `vi.mock` stubs; never mock own
  hooks or context.
- Components that only take props are rendered without providers.
- Data hooks are tested with `renderHook` + MSW, covering every status, retries, and request races
  **(review)**.
- `await screen.findBy…` for async UI; no redundant `waitFor` or `act()`.

## 5. Enforcement

In addition to the [common enforcement](common.md#5-enforcement):

| Rule | Tool |
|---|---|
| Function components only | `eslint-plugin-react-prefer-function-component` |
| Hooks correctness & render purity | `eslint-plugin-react-hooks` flat `recommended` (includes the React Compiler rules `purity`, `immutability`, `set-state-in-render`, …), with `exhaustive-deps` raised to error |
| `fetch` only in `src/client/api/` | `no-restricted-globals` (`fetch`), disabled for `src/client/api/**` |
| No hard-coded UI text | `react/jsx-no-literals`, with per-file documented exceptions |
| Testing Library conventions | `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`, `no-restricted-syntax` banning `getByTestId` — scoped to `tests/**` |
| Client never imports the server | `no-restricted-imports` (`@/server/*`) scoped to `src/client/**` |
| Every component/util has a test | `scripts/check-tests.ts` |
| Coverage | Vitest `coverage.thresholds` |
