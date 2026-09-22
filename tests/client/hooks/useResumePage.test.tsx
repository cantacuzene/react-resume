import { renderHook, waitFor } from '@testing-library/react'
import { delay, graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import type { Lang } from '@/client/api/types'
import { useResumePage } from '@/client/hooks/useResumePage'
import { resumePageFixture } from '../../support/fixtures'
import { server } from '../../support/server'

const aboutTitle = (lang: Lang) => resumePageFixture(lang).translations.sections.about

describe('useResumePage', () => {
  it('goes from loading to success', async () => {
    const { result } = renderHook(() => useResumePage('FR'))

    expect(result.current.status).toBe('loading')
    await waitFor(() => {
      expect(result.current).toMatchObject({
        status: 'success',
        data: { translations: { sections: { about: aboutTitle('FR') } } },
      })
    })
  })

  it.each([
    ['network', graphql.query('ResumePage', () => HttpResponse.error()), { kind: 'network' }],
    [
      'HTTP 500',
      graphql.query('ResumePage', () => HttpResponse.json({}, { status: 500 })),
      { kind: 'http', status: 500 },
    ],
    [
      'GraphQL errors',
      graphql.query('ResumePage', () => HttpResponse.json({ errors: [{ message: 'boom' }] })),
      { kind: 'graphql', messages: ['boom'] },
    ],
  ] as const)('reports a %s failure', async (_name, handler, error) => {
    server.use(handler)
    const { result } = renderHook(() => useResumePage('FR'))

    await waitFor(() => {
      expect(result.current).toMatchObject({ status: 'error', error })
    })
  })

  it('refetches on retry', async () => {
    server.use(graphql.query('ResumePage', () => HttpResponse.error(), { once: true }))
    const { result } = renderHook(() => useResumePage('EN'))
    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    if (result.current.status === 'error') {
      result.current.retry()
    }

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })
  })

  it('keeps the latest language when responses arrive out of order', async () => {
    const delays: Readonly<Record<Lang, number>> = { FR: 10, EN: 200 }
    server.use(
      graphql.query<object, { lang: Lang }>('ResumePage', async ({ variables }) => {
        await delay(delays[variables.lang])
        return HttpResponse.json({ data: resumePageFixture(variables.lang) })
      }),
    )
    const { result, rerender } = renderHook(({ lang }) => useResumePage(lang), {
      initialProps: { lang: 'FR' as Lang },
    })

    rerender({ lang: 'EN' })
    rerender({ lang: 'FR' })

    await waitFor(() => {
      expect(result.current).toMatchObject({
        status: 'success',
        data: { translations: { sections: { about: aboutTitle('FR') } } },
      })
    })
    await delay(250)
    expect(result.current).toMatchObject({
      data: { translations: { sections: { about: aboutTitle('FR') } } },
    })
  })
})
