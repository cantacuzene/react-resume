# Backend Guidelines (Bun + GraphQL)

These rules apply to the backend, **in addition to** [`common.md`](common.md).

> **Status: partial.** Only the rules decided so far are listed. This file is completed during the
> backend migration brainstorm (sub-project 3).

## 1. Runtime & API

- Runtime: **Bun**, TypeScript executed natively.
- The backend exposes a **single GraphQL endpoint**, `POST /graphql`. No REST routes.
- **Translations are served by the backend**: resume content and all UI strings. Every
  translation field in the schema is non-nullable (`String!`).

## 2. Testing

- Test runner: **`bun test`**.
- Translation completeness is tested: every translation field is present and non-empty in every
  supported language.

## 3. Enforcement

In addition to the [common enforcement](common.md#5-enforcement):

| Rule | Tool |
|---|---|
| Coverage | `bun test --coverage` with `coverageThreshold` in `bunfig.toml` |
