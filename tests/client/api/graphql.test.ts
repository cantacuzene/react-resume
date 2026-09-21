import { delay, graphql as mockGraphql, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { request } from '@/client/api/graphql'
import { ResumePageDocument } from '@/client/gql/graphql'
import { server } from '../../support/server'

const run = (signal = new AbortController().signal) =>
  request(ResumePageDocument, { lang: 'EN' }, signal)

describe('request', () => {
  it('returns the data', async () => {
    const result = await run()

    expect(result.ok && result.value.translations.sections.about).toBe('About')
  })

  it('reports network failures', async () => {
    server.use(mockGraphql.query('ResumePage', () => HttpResponse.error()))

    expect(await run()).toEqual({ ok: false, error: { kind: 'network' } })
  })

  it('reports HTTP errors', async () => {
    server.use(mockGraphql.query('ResumePage', () => HttpResponse.json({}, { status: 500 })))

    expect(await run()).toEqual({ ok: false, error: { kind: 'http', status: 500 } })
  })

  it('reports GraphQL errors', async () => {
    server.use(
      mockGraphql.query('ResumePage', () =>
        HttpResponse.json({ errors: [{ message: 'Unexpected error.' }] }),
      ),
    )

    expect(await run()).toEqual({
      ok: false,
      error: { kind: 'graphql', messages: ['Unexpected error.'] },
    })
  })

  it('reports an unparseable body', async () => {
    // graphql handlers only allow JSON bodies: a plain HTTP handler returns the broken one
    server.use(http.post('*', () => HttpResponse.text('not json')))

    expect(await run()).toEqual({ ok: false, error: { kind: 'parse' } })
  })

  it('reports an aborted request without throwing', async () => {
    server.use(
      mockGraphql.query('ResumePage', async () => {
        await delay(1_000)
        return HttpResponse.json({ data: null })
      }),
    )
    const controller = new AbortController()
    const pending = run(controller.signal)
    controller.abort()

    expect(await pending).toEqual({ ok: false, error: { kind: 'aborted' } })
  })
})
