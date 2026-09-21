import { readFileSync } from 'node:fs'

// The SDL is the source of truth (docs/guidelines/backend.md); codegen reads the same file
export const typeDefs: string = readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8')
