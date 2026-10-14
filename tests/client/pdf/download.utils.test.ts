// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resumeFileName } from '@/client/pdf/download.utils'

describe('resumeFileName', () => {
  it('names the file after the person and the language', () => {
    expect(resumeFileName('Hugo Cantacuzene', 'EN')).toBe('hugo-cantacuzene-cv-en.pdf')
    expect(resumeFileName('Hugo Cantacuzene', 'FR')).toBe('hugo-cantacuzene-cv-fr.pdf')
  })

  it('strips accents and punctuation', () => {
    expect(resumeFileName('Hugo Cantacuzène-É!', 'FR')).toBe('hugo-cantacuzene-e-cv-fr.pdf')
  })
})
