// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatMonth, otherLanguages } from '@/client/i18n/languages.utils'

describe('otherLanguages', () => {
  it('lists every language except the current one', () => {
    const languages = [
      { code: 'FR', label: 'Français' },
      { code: 'EN', label: 'Anglais' },
    ] as const

    expect(otherLanguages('FR', languages)).toEqual([{ code: 'EN', label: 'Anglais' }])
  })
})

describe('formatMonth', () => {
  it('formats as MM/yyyy in French', () => {
    expect(formatMonth('2018-01-01', 'FR')).toBe('01/2018')
  })

  it('formats as MMM yyyy in English', () => {
    expect(formatMonth('2018-01-01', 'EN')).toBe('Jan 2018')
  })
})
