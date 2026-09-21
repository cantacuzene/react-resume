// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { lintViolations, VIRTUAL_FILES } from '../support/lint'

const { server, shared } = VIRTUAL_FILES

describe('ESLint server and shared rules', { timeout: 30_000 }, () => {
  it('accepts a compliant server module', async () => {
    expect(
      await lintViolations(server, 'export const double = (n: number): number => n * 2\n'),
    ).toEqual([])
  })

  it('forbids React in server code', async () => {
    expect(
      await lintViolations(
        server,
        "import { useState } from 'react'\n\nexport const s = useState\n",
      ),
    ).toContain('no-restricted-imports')
  })

  it('forbids client code in server code', async () => {
    expect(
      await lintViolations(server, "import { App } from '@/client/App'\n\nexport const a = App\n"),
    ).toContain('no-restricted-imports')
  })

  it('forbids DOM globals in server code', async () => {
    expect(
      await lintViolations(server, 'export const title = (): string => document.title\n'),
    ).toContain('no-restricted-globals')
  })

  it('does not apply client-only rules to server code', async () => {
    expect(
      await lintViolations(server, "export const load = (): Promise<Response> => fetch('/x')\n"),
    ).toEqual([])
  })

  it('accepts a compliant shared module', async () => {
    expect(
      await lintViolations(shared, 'export const isEven = (n: number): boolean => n % 2 === 0\n'),
    ).toEqual([])
  })

  it('forbids Bun in shared code', async () => {
    expect(
      await lintViolations(shared, 'export const version = (): string => Bun.version\n'),
    ).toContain('no-restricted-globals')
  })

  it('forbids server imports in shared code', async () => {
    expect(
      await lintViolations(shared, "import { x } from '@/server/x'\n\nexport const y = x\n"),
    ).toContain('no-restricted-imports')
  })

  it('forbids React in shared code', async () => {
    expect(
      await lintViolations(
        shared,
        "import { useState } from 'react'\n\nexport const s = useState\n",
      ),
    ).toContain('no-restricted-imports')
  })

  it('forbids DOM globals in shared code', async () => {
    expect(
      await lintViolations(shared, 'export const width = (): number => window.innerWidth\n'),
    ).toContain('no-restricted-globals')
  })
})
