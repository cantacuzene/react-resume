// @vitest-environment node
import { renderToBuffer } from '@react-pdf/renderer'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { describe, expect, it } from 'vitest'
import { ResumePdf } from '@/client/pdf/ResumePdf'
import { resumeDocument } from '@/client/pdf/resumeDocument.utils'
import { resumePageFixture } from '../../support/fixtures'

const { resume, translations } = resumePageFixture('EN')
const blocks = resumeDocument({ resume, translations }, 'EN')

// What makes the document AI-readable is its text layer, so the test reads it back out
const textLayerOf = async (pdf: Readonly<Uint8Array>): Promise<string> => {
  const document = await getDocument({ data: pdf, useSystemFonts: true }).promise
  const pages = await Promise.all(
    Array.from({ length: document.numPages }, async (_unused, index) => {
      const page = await document.getPage(index + 1)
      const content = await page.getTextContent()
      // pdfjs yields text items and marked-content markers; only the former carry text
      return content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
    }),
  )

  return pages.join('\n').replace(/\s+/gu, ' ')
}

// Rendered once for the whole file; every test awaits the same document
const pdfFile = renderToBuffer(<ResumePdf blocks={blocks} title="Resume" />)
const textLayer = pdfFile.then((bytes) => textLayerOf(new Uint8Array(bytes)))

describe('ResumePdf', () => {
  it('produces a PDF file', async () => {
    expect((await pdfFile).subarray(0, 5).toString()).toBe('%PDF-')
  })

  it('writes the profile into the text layer', async () => {
    const text = await textLayer

    expect(text).toContain(resume.profile.name)
    expect(text).toContain(resume.profile.jobTitle)
    expect(text).toContain(resume.profile.email)
  })

  it('keeps the sections in the order of the block model', async () => {
    const text = await textLayer
    const { sections } = translations
    const positions = [
      resume.profile.name,
      sections.about,
      sections.skills,
      sections.education,
      sections.languages,
      sections.experiences,
    ].map((heading) => text.indexOf(heading))

    expect(positions).toEqual([...positions].sort((a, b) => a - b))
    expect(positions.every((position) => position >= 0)).toBe(true)
  })

  it('writes the ratings, the dates and the labelled fields as text', async () => {
    const text = await textLayer

    expect(text).toContain('C# / .NET (2.x - 10.x+): 90/100')
    expect(text).toContain('English: 87%')
    expect(text).toContain(`Sep 2024 - ${translations.timeline.present}`)
    expect(text).toContain(`${translations.timeline.stack}: Nix, NixOS`)
  })

  it('lists every position and every interest', async () => {
    const text = await textLayer

    resume.experiences.forEach(({ company }) => {
      expect(text).toContain(company)
    })
    resume.about.interests.forEach((interest) => {
      expect(text).toContain(interest)
    })
  })
})
