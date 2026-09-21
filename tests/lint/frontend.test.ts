// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { lintViolations, VIRTUAL_FILES } from '../support/lint'

const { source, api, component, test } = VIRTUAL_FILES

describe('ESLint frontend rules', { timeout: 30_000 }, () => {
  it('accepts a compliant component', async () => {
    expect(
      await lintViolations(
        component,
        'export const Title = ({ text }: Readonly<{ text: string }>) => (\n  <h1 className="title">{text}</h1>\n)\n',
      ),
    ).toEqual([])
  })

  it('forbids class components', async () => {
    const code = [
      "import { Component } from 'react'",
      '',
      'export class Legacy extends Component {',
      '  render() {',
      '    return null',
      '  }',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(component, code)).toContain(
      'react-prefer-function-component/react-prefer-function-component',
    )
  })

  it('enforces the rules of hooks', async () => {
    const code = [
      "import { useEffect } from 'react'",
      '',
      'export const Tracker = ({ id }: Readonly<{ id: string }>) => {',
      '  if (id) {',
      '    useEffect(() => undefined)',
      '  }',
      '  return null',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(component, code)).toContain('react-hooks/rules-of-hooks')
  })

  it('enforces exhaustive hook dependencies, in .ts hooks too', async () => {
    const code = [
      "import { useEffect } from 'react'",
      '',
      'export const useTracker = (id: string): void => {',
      '  useEffect(() => {',
      '    console.log(id)',
      '  }, [])',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(source, code)).toContain('react-hooks/exhaustive-deps')
  })

  it('forbids fetch outside src/client/api', async () => {
    expect(
      await lintViolations(source, "export const load = (): Promise<Response> => fetch('/x')\n"),
    ).toContain('no-restricted-globals')
  })

  it('allows fetch in src/client/api', async () => {
    expect(
      await lintViolations(api, "export const load = (): Promise<Response> => fetch('/x')\n"),
    ).toEqual([])
  })

  it('forbids globalThis.fetch outside src/client/api', async () => {
    expect(
      await lintViolations(
        source,
        "export const load = (): Promise<Response> => globalThis.fetch('/x')\n",
      ),
    ).toContain('no-restricted-properties')
  })

  it('forbids window.fetch outside src/client/api', async () => {
    expect(
      await lintViolations(
        source,
        "export const load = (): Promise<Response> => window.fetch('/x')\n",
      ),
    ).toContain('no-restricted-properties')
  })

  it('allows globalThis.fetch in src/client/api', async () => {
    expect(
      await lintViolations(
        api,
        "export const load = (): Promise<Response> => globalThis.fetch('/x')\n",
      ),
    ).toEqual([])
  })

  it('forbids server imports in client code', async () => {
    expect(
      await lintViolations(
        source,
        "import { content } from '@/server/content'\n\nexport const c = content\n",
      ),
    ).toContain('no-restricted-imports')
  })

  it('forbids hard-coded text in components', async () => {
    expect(
      await lintViolations(component, 'export const Greeting = () => <p>Hello</p>\n'),
    ).toContain('react/jsx-no-literals')
  })

  it('forbids function-declaration components', async () => {
    expect(
      await lintViolations(component, 'export function Title() {\n  return null\n}\n'),
    ).toContain('react/function-component-definition')
  })

  it('forbids impure render (React Compiler purity)', async () => {
    const code = [
      'export const Random = () => {',
      '  const value = Math.random()',
      '  return <p>{value}</p>',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(component, code)).toContain('react-hooks/purity')
  })

  it('accepts a compliant test', async () => {
    const code = [
      "import '@testing-library/jest-dom/vitest'",
      "import { render, screen } from '@testing-library/react'",
      "import { expect, it } from 'vitest'",
      '',
      "it('renders the main landmark', () => {",
      '  render(<main />)',
      '',
      "  expect(screen.getByRole('main')).toBeInTheDocument()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toEqual([])
  })

  it('forbids getByTestId', async () => {
    const code = [
      "import '@testing-library/jest-dom/vitest'",
      "import { render, screen } from '@testing-library/react'",
      "import { expect, it } from 'vitest'",
      '',
      "it('renders', () => {",
      '  render(<main />)',
      '',
      "  expect(screen.getByTestId('main')).toBeInTheDocument()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('no-restricted-syntax')
  })

  it('enforces screen queries', async () => {
    const code = [
      "import { render } from '@testing-library/react'",
      "import { it } from 'vitest'",
      '',
      "it('renders', () => {",
      '  const { getByRole } = render(<main />)',
      "  getByRole('main')",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('testing-library/prefer-screen-queries')
  })

  it('enforces jest-dom matchers', async () => {
    const code = [
      "import '@testing-library/jest-dom/vitest'",
      "import { render, screen } from '@testing-library/react'",
      "import { expect, it } from 'vitest'",
      '',
      "it('renders', () => {",
      '  render(<main />)',
      '',
      "  expect(screen.queryByRole('main')).not.toBeNull()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('jest-dom/prefer-in-document')
  })
})
