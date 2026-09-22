// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { classNames } from '@/client/styles/classNames.utils'

describe('classNames', () => {
  it('joins the defined class names', () => {
    expect(classNames('link', undefined, 'github', '')).toBe('link github')
  })

  it('returns an empty string when none is defined', () => {
    expect(classNames(undefined)).toBe('')
  })
})
