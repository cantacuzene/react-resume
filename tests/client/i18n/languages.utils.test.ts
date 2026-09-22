// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatMonth, otherLanguages, resolveInitialLang } from '@/client/i18n/languages.utils'

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

describe('resolveInitialLang', () => {
  it('prefers the saved language', () => {
    expect(resolveInitialLang('FR', ['en-US'])).toBe('FR')
  })

  it('ignores an unknown saved value', () => {
    expect(resolveInitialLang('DE', ['fr-FR'])).toBe('FR')
  })

  it('uses the first supported browser language, whatever its region', () => {
    expect(resolveInitialLang(null, ['fr-CA', 'en-GB'])).toBe('FR')
    expect(resolveInitialLang(null, ['EN-gb', 'fr'])).toBe('EN')
  })

  it('skips unsupported browser languages', () => {
    expect(resolveInitialLang(null, ['de-DE', 'fr'])).toBe('FR')
  })

  it('does not match a language that only starts with the same letters', () => {
    expect(resolveInitialLang(null, ['fro', 'enm'])).toBe('EN')
    expect(resolveInitialLang(null, ['fro', 'fr'])).toBe('FR')
  })

  it('falls back to English', () => {
    expect(resolveInitialLang(null, ['ja-JP'])).toBe('EN')
    expect(resolveInitialLang(null, [])).toBe('EN')
  })
})
