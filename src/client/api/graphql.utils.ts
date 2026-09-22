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
