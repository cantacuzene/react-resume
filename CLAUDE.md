# react-resume

Migration in progress. The old app lives in `legacy/`: reference only, never built, edited or
linted.

## Mandatory guidelines

- [docs/guidelines/common.md](docs/guidelines/common.md): all TypeScript code
- [docs/guidelines/frontend.md](docs/guidelines/frontend.md): React frontend
- [docs/guidelines/backend.md](docs/guidelines/backend.md): Bun backend

## Commands

- `bun run verify`: every check; runs on pre-commit and in CI, and must pass
- `bun run dev`: start Vite
- `bun run test`: Vitest with coverage
- The pre-commit hook (Lefthook) runs `verify` on the whole working tree, not just staged files:
  stash or commit unrelated work in progress before committing.
- `bun` must be on `PATH` for the pre-commit hook to run, including when committing from a GUI git
  client.
