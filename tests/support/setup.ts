import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

beforeAll(() => {
  server.listen({
    onUnhandledRequest: (request, print) => {
      // @react-pdf/renderer loads its layout engine from a data: URL, which is not network
      // traffic. Every real unhandled request still fails the test.
      if (new URL(request.url).protocol !== 'data:') {
        print.error()
      }
    },
  })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
  // Files marked `@vitest-environment node` have no localStorage.
  if (typeof localStorage !== 'undefined') {
    localStorage.clear()
  }
})

afterAll(() => {
  server.close()
})
