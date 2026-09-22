# react-resume

Personal resume: React frontend in `src/client/`, Bun + GraphQL API in `src/server/`, shared
runtime-neutral code in `src/shared/`.

## Mandatory guidelines

- [docs/guidelines/common.md](docs/guidelines/common.md): all TypeScript code
- [docs/guidelines/frontend.md](docs/guidelines/frontend.md): React frontend
- [docs/guidelines/backend.md](docs/guidelines/backend.md): Bun backend

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
