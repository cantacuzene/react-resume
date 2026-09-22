# react-resume

Personal resume: React frontend in `src/client/`, Bun + GraphQL API in `src/server/`, shared
runtime-neutral code in `src/shared/`.

## Mandatory guidelines

- [docs/guidelines/common.md](docs/guidelines/common.md): all TypeScript code
- [docs/guidelines/frontend.md](docs/guidelines/frontend.md): React frontend
- [docs/guidelines/backend.md](docs/guidelines/backend.md): Bun backend

## Workflow

- Every piece of work starts with a GitHub issue (`enhancement` for features, `bug` for fixes)
  and ships through pull requests. Nothing is committed straight to `master`.
- One-step work: one branch from `master`, one PR targeting `master`, with `Closes #N` in its body.
- Multi-step work: the issue lists every step as a checkbox, and each step gets its own branch
  and PR, stacked. Step 1 branches from `master` and targets it; each later step branches from
  the previous step's branch and targets it. Every PR says `Part of #N`, except the last, which
  says `Closes #N`. Tick a step's box when its PR opens.
- Always branch from an up-to-date `master` (`git checkout master && git pull --ff-only`).
- Open each PR once `bun run verify` passes. The owner merges stacks bottom-up.

## Commands

- `bun run verify`: every check; runs on pre-commit and in CI, and must pass
- `bun run dev`: start Vite (frontend)
- `bun run dev:server`: start the GraphQL API with reload (`http://localhost:4000/graphql`)
- `bun run start`: start the GraphQL API
- `bun run codegen`: regenerate `src/server/gql/` after editing `src/server/schema.graphql`
- `bun run test`: Vitest with coverage
- Run `bun run dev:server` and `bun run dev` together for local development
- The pre-commit hook (Lefthook) runs `verify` on the whole working tree, not just staged files:
  stash or commit unrelated work in progress before committing.
- `bun` must be on `PATH` for the pre-commit hook to run, including when committing from a GUI git
  client.

## Server environment

- `PORT`: API port, default `4000`
- `CORS_ORIGINS`: comma-separated allowed origins, default `http://localhost:5173`
- `NODE_ENV=production`: disables GraphiQL

## Frontend environment

- `VITE_GRAPHQL_URL`: GraphQL endpoint, default `http://localhost:4000/graphql`
