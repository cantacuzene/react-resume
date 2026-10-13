// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resumePageFixture } from './fixtures'

describe('resumePageFixture', () => {
  it('serializes dates like the Date scalar', () => {
    const { experiences } = resumePageFixture('EN').resume
    const [current] = experiences
    const finished = experiences.find(({ end }) => end !== null)

    expect(current).toMatchObject({ id: '6', start: '2024-09-01', end: null })
    expect(finished).toMatchObject({ start: '2015-04-01', end: '2017-05-01' })
  })

  it('returns the requested language', () => {
    expect(resumePageFixture('FR').translations.sections.about).toBe('À propos')
    expect(resumePageFixture('EN').translations.sections.about).toBe('About')
  })
})
