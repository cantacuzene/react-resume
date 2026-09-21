// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createServer } from '@/server/yoga'

const ALLOWED_ORIGIN = 'http://localhost:5173'
const RESUME_PAGE = `
  query ResumePage($lang: Lang!) {
    resume(lang: $lang) {
      profile { name }
      experiences { id start end }
    }
    translations(lang: $lang) { sections { about } }
    siteLanguages(lang: $lang) { code label }
  }
`

const yoga = createServer({ corsOrigins: [ALLOWED_ORIGIN], graphiql: false })

const post = (body: unknown): Promise<Response> =>
  Promise.resolve(
    yoga.fetch('http://localhost/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )

const preflight = (origin: string): Promise<Response> =>
  Promise.resolve(
    yoga.fetch('http://localhost/graphql', {
      method: 'OPTIONS',
      headers: { origin, 'access-control-request-method': 'POST' },
    }),
  )

describe('createServer', () => {
  it('answers the ResumePage query in French', async () => {
    const response = await post({ query: RESUME_PAGE, variables: { lang: 'FR' } })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      data: {
        resume: {
          profile: { name: 'Hugo Cantacuzene' },
          experiences: expect.arrayContaining([
            { id: '5', start: '2018-01-01', end: null },
          ]) as unknown,
        },
        translations: { sections: { about: 'À propos' } },
      },
    })
  })

  it('answers the ResumePage query in English', async () => {
    const response = await post({ query: RESUME_PAGE, variables: { lang: 'EN' } })

    expect(await response.json()).toMatchObject({
      data: { translations: { sections: { about: 'About' } } },
    })
  })

  it('rejects an unknown language', async () => {
    const response = await post({ query: RESUME_PAGE, variables: { lang: 'DE' } })
    const body = (await response.json()) as { errors?: ReadonlyArray<unknown> }

    expect(body.errors).toHaveLength(1)
  })

  it('returns 404 outside /graphql', async () => {
    const response = await yoga.fetch('http://localhost/api/en/Skills')

    expect(response.status).toBe(404)
  })

  it('allows CORS for configured origins', async () => {
    const response = await preflight(ALLOWED_ORIGIN)

    expect(response.headers.get('access-control-allow-origin')).toBe(ALLOWED_ORIGIN)
  })

  it('does not allow CORS for other origins', async () => {
    const response = await preflight('https://evil.example')

    expect(response.headers.get('access-control-allow-origin')).not.toBe('https://evil.example')
  })

  it('serves GraphiQL only when enabled', async () => {
    const withGraphiql = createServer({ corsOrigins: [ALLOWED_ORIGIN], graphiql: true })
    const request = { headers: { accept: 'text/html' } }

    const enabled = await withGraphiql.fetch('http://localhost/graphql', request)
    const disabled = await yoga.fetch('http://localhost/graphql', request)

    expect(enabled.headers.get('content-type')).toContain('text/html')
    expect(disabled.headers.get('content-type') ?? '').not.toContain('text/html')
  })
})
