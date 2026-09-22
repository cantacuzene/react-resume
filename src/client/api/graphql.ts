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
