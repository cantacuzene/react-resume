// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { DEFAULT_GRAPHQL_URL, parseResponse, resolveGraphqlUrl } from '@/client/api/graphql.utils'

describe('resolveGraphqlUrl', () => {
  it('uses a configured URL', () => {
    expect(resolveGraphqlUrl('https://api.example/graphql')).toBe('https://api.example/graphql')
  })

  it.each([undefined, '', 42])('falls back to the default for %j', (value) => {
    expect(resolveGraphqlUrl(value)).toBe(DEFAULT_GRAPHQL_URL)
  })
})

describe('parseResponse', () => {
  it('returns the data of a successful response', () => {
    expect(parseResponse(200, { data: { a: 1 } })).toEqual({ ok: true, value: { a: 1 } })
  })

  it('reports non-2xx statuses', () => {
    expect(parseResponse(500, { data: null })).toEqual({
      ok: false,
      error: { kind: 'http', status: 500 },
    })
  })

  it('reports GraphQL errors', () => {
    expect(parseResponse(200, { errors: [{ message: 'boom' }, {}] })).toEqual({
      ok: false,
      error: { kind: 'graphql', messages: ['boom', 'Unknown GraphQL error'] },
    })
  })

  it.each([undefined, 'text', { data: null }, {}])('reports an unusable body %j', (body) => {
    expect(parseResponse(200, body)).toEqual({ ok: false, error: { kind: 'parse' } })
  })
})
