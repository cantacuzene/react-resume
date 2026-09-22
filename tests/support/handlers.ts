import { graphql, HttpResponse, type RequestHandler } from 'msw'
import type { Lang } from '@/client/api/types'
import { resumePageFixture } from './fixtures'

// Default handlers shared by all tests
export const handlers: ReadonlyArray<RequestHandler> = [
  graphql.query<object, { lang: Lang }>('ResumePage', ({ variables }) =>
    HttpResponse.json({ data: resumePageFixture(variables.lang) }),
  ),
]
