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
})
