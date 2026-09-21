// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isIgnored, lintViolations, VIRTUAL_FILES } from '../support/lint'

const { source, test, config } = VIRTUAL_FILES

describe('ESLint common rules', { timeout: 30_000 }, () => {
  it('accepts compliant code', async () => {
    expect(
      await lintViolations(source, 'export const double = (n: number): number => n * 2\n'),
    ).toEqual([])
  })

  it('forbids let', async () => {
    expect(
      await lintViolations(source, 'let count = 1\nexport const next = count + 1\n'),
    ).toContain('functional/no-let')
  })

  it('forbids mutating data', async () => {
    const code = [
      'export const build = (): ReadonlyArray<number> => {',
      '  const values: number[] = []',
      '  values.push(1)',
      '  return values',
      '}',
      '',
    ].join('\n')

    expect(await lintViolations(source, code)).toContain('functional/immutable-data')
  })

  it('forbids loops', async () => {
    expect(
      await lintViolations(source, 'for (const x of [1, 2]) {\n  console.log(x)\n}\n'),
    ).toContain('functional/no-loop-statements')
  })

  it('forbids classes', async () => {
    expect(await lintViolations(source, 'export class Counter {}\n')).toContain(
      'functional/no-classes',
    )
  })

  it('forbids this', async () => {
    expect(
      await lintViolations(
        source,
        'export function read(this: unknown): unknown {\n  return this\n}\n',
      ),
    ).toContain('functional/no-this-expressions')
  })

  it('requires readonly parameters', async () => {
    expect(
      await lintViolations(source, 'export const count = (xs: string[]): number => xs.length\n'),
    ).toContain('functional/prefer-immutable-types')
  })

  it('accepts readonly parameters', async () => {
    expect(
      await lintViolations(
        source,
        'export const count = (xs: ReadonlyArray<string>): number => xs.length\n',
      ),
    ).toEqual([])
  })

  it('forbids any', async () => {
    expect(await lintViolations(source, 'export const value: any = 1\n')).toContain(
      '@typescript-eslint/no-explicit-any',
    )
  })

  it('forbids default exports', async () => {
    expect(await lintViolations(source, 'export default 1\n')).toContain('import/no-default-export')
  })

  it('allows default exports in tool config files', async () => {
    expect(await lintViolations(config, 'export default {}\n')).toEqual([])
  })

  it('forbids snapshot tests', async () => {
    const code = [
      "import { expect, it } from 'vitest'",
      '',
      "it('renders', () => {",
      "  expect('x').toMatchSnapshot()",
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('no-restricted-syntax')
  })

  it('forbids mocking own modules', async () => {
    expect(
      await lintViolations(test, "import { vi } from 'vitest'\n\nvi.mock('@/api/graphql')\n"),
    ).toContain('no-restricted-syntax')
  })

  it('allows mocking third-party modules', async () => {
    expect(
      await lintViolations(
        test,
        "import { vi } from 'vitest'\n\nvi.mock('highcharts-react-official')\n",
      ),
    ).toEqual([])
  })

  it('forbids snapshot test variants', async () => {
    const code = [
      "import { expect, it } from 'vitest'",
      '',
      "it('throws', () => {",
      '  expect(() => 1).toThrowErrorMatchingInlineSnapshot()',
      '})',
      '',
    ].join('\n')

    expect(await lintViolations(test, code)).toContain('no-restricted-syntax')
  })

  it('forbids mocking own modules via a relative specifier', async () => {
    expect(
      await lintViolations(test, "import { vi } from 'vitest'\n\nvi.mock('../src/api/graphql')\n"),
    ).toContain('no-restricted-syntax')
  })

  it('forbids mocking own modules via a dynamic import specifier', async () => {
    expect(
      await lintViolations(test, "import { vi } from 'vitest'\n\nvi.mock(import('@/App'))\n"),
    ).toContain('no-restricted-syntax')
  })

  it('forbids tests from importing sources by reaching into src', async () => {
    expect(
      await lintViolations(test, "import { App } from '../src/App'\n\nexport const check = App\n"),
    ).toContain('no-restricted-imports')
  })

  it('allows tests to import scripts outside src', async () => {
    expect(
      await lintViolations(
        test,
        "import { missingTests } from '../scripts/lib/missingTests'\n\nexport const check = missingTests\n",
      ),
    ).toEqual([])
  })

  it('forbids interface declarations', async () => {
    expect(
      await lintViolations(source, 'export interface A {\n  readonly x: number\n}\n'),
    ).toContain('@typescript-eslint/consistent-type-definitions')
  })

  it('ignores the legacy folder', async () => {
    expect(await isIgnored('legacy/src/index.js')).toBe(true)
  })

  it('ignores the .superpowers scratch folder', async () => {
    expect(await isIgnored('.superpowers/x.ts')).toBe(true)
  })
})
