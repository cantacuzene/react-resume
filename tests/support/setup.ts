import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
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
