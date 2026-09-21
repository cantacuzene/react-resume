// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { parseConfig } from '@/server/config.utils'

describe('parseConfig', () => {
  it('applies the defaults', () => {
    expect(parseConfig({})).toEqual({
      ok: true,
      value: { port: 4000, corsOrigins: ['http://localhost:5173'], graphiql: true },
    })
  })

  it('reads a valid PORT', () => {
    expect(parseConfig({ PORT: '8080' })).toMatchObject({ ok: true, value: { port: 8080 } })
  })

  it.each(['abc', '0', '65536', '80.5', '-1', ''])('rejects PORT=%j', (port) => {
    expect(parseConfig({ PORT: port })).toEqual({
      ok: false,
      error: `PORT must be an integer between 1 and 65535, got "${port}"`,
    })
  })

  it('reads and trims CORS_ORIGINS', () => {
    expect(
      parseConfig({ CORS_ORIGINS: ' https://cantacuzene.github.io , http://localhost:4173/ ' }),
    ).toMatchObject({
      ok: true,
      value: { corsOrigins: ['https://cantacuzene.github.io', 'http://localhost:4173'] },
    })
  })

  it('rejects an empty CORS_ORIGINS entry', () => {
    expect(parseConfig({ CORS_ORIGINS: 'https://a.example,,https://b.example' })).toEqual({
      ok: false,
      error: 'CORS_ORIGINS contains an empty entry',
    })
  })

  it('rejects a CORS_ORIGINS entry that is not a URL', () => {
    expect(parseConfig({ CORS_ORIGINS: 'not a url' })).toEqual({
      ok: false,
      error: 'CORS_ORIGINS entry "not a url" is not an http(s) URL',
    })
  })

  it('rejects a CORS_ORIGINS entry with another scheme', () => {
    expect(parseConfig({ CORS_ORIGINS: 'ftp://files.example' })).toEqual({
      ok: false,
      error: 'CORS_ORIGINS entry "ftp://files.example" is not an http(s) URL',
    })
  })

  it('disables GraphiQL in production', () => {
    expect(parseConfig({ NODE_ENV: 'production' })).toMatchObject({
      ok: true,
      value: { graphiql: false },
    })
  })

  it('reports the PORT error before CORS_ORIGINS errors', () => {
    expect(parseConfig({ PORT: 'x', CORS_ORIGINS: 'not a url' })).toMatchObject({
      ok: false,
      error: expect.stringContaining('PORT') as unknown,
    })
  })
})
