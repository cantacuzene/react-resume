// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { err, ok, type Result } from '@/shared/result'

const describeResult = (result: Result<number, string>): string =>
  result.ok ? `value ${String(result.value)}` : `error ${result.error}`

describe('Result', () => {
  it('wraps a value with ok', () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 })
  })

  it('wraps an error with err', () => {
    expect(err('boom')).toEqual({ ok: false, error: 'boom' })
  })

  it('narrows on the ok flag', () => {
    expect(describeResult(ok(2))).toBe('value 2')
    expect(describeResult(err('boom'))).toBe('error boom')
  })
})
