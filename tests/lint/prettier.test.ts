// @vitest-environment node
import { format, resolveConfig } from 'prettier'
import { describe, expect, it } from 'vitest'

const SAMPLE_PATH = 'src/sample.ts'

const formatTs = async (code: string): Promise<string> => {
  const options = await resolveConfig(SAMPLE_PATH)
  return format(code, { ...options, filepath: SAMPLE_PATH })
}

describe('Prettier config', () => {
  it('removes semicolons', async () => {
    expect(await formatTs('const a = 1;\n')).toBe('const a = 1\n')
  })

  it('uses single quotes', async () => {
    expect(await formatTs('const a = "x"\n')).toBe("const a = 'x'\n")
  })

  it('adds trailing commas to multi-line literals', async () => {
    const longArray = `const values = [${'"aaaaaaaaaa", '.repeat(10)}]\n`

    expect(await formatTs(longArray)).toContain("'aaaaaaaaaa',\n]")
  })

  it('keeps a line at or under 100 characters on one line', async () => {
    const values = Array.from({ length: 6 }, () => "'aaaaaaaaaa'").join(', ')
    const line = `const values = [${values}]\n`
    expect(line.length - 1).toBeLessThanOrEqual(100)

    expect(await formatTs(line)).toBe(line)
  })

  it('wraps a line over 100 characters onto multiple lines', async () => {
    const values = Array.from({ length: 7 }, () => "'aaaaaaaaaa'").join(', ')
    const line = `const values = [${values}]\n`
    expect(line.length - 1).toBeGreaterThan(100)

    const formatted = await formatTs(line)
    expect(formatted).not.toBe(line)
    expect(formatted).toContain('\n')
  })
})
