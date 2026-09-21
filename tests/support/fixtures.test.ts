// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resumePageFixture } from './fixtures'

describe('resumePageFixture', () => {
  it('serializes dates like the Date scalar', () => {
    const [current] = resumePageFixture('EN').resume.experiences

    expect(current).toMatchObject({ id: '5', start: '2018-01-01', end: null })
  })

  it('returns the requested language', () => {
    expect(resumePageFixture('FR').translations.sections.about).toBe('À propos')
    expect(resumePageFixture('EN').translations.sections.about).toBe('About')
  })
})
