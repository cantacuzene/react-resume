import { describe, expect, it } from 'vitest'
import { renderResumePdf } from '@/client/pdf/renderResumePdf'
import { resumeDocument } from '@/client/pdf/resumeDocument.utils'
import { resumePageFixture } from '../../support/fixtures'

describe('renderResumePdf', () => {
  it('renders the blocks into a PDF blob', async () => {
    const { resume, translations } = resumePageFixture('EN')
    const blob = await renderResumePdf(resumeDocument({ resume, translations }, 'EN'), 'Resume')

    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(1000)
  })
})
