import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Timeline } from '@/client/components/Timeline/Timeline'
import { resumePageFixture } from '../../../support/fixtures'

describe('Timeline', () => {
  it('renders every experience under the section title', () => {
    const { resume, translations } = resumePageFixture('EN')
    render(
      <Timeline
        experiences={resume.experiences}
        title="Experience"
        t={translations.timeline}
        lang="EN"
      />,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(resume.experiences.length)
    expect(screen.getAllByText('Present')).toHaveLength(2)
  })

  it('puts positions that overlap in time in the same row', () => {
    const { resume, translations } = resumePageFixture('EN')

    render(
      <Timeline
        experiences={resume.experiences}
        title="Experience"
        t={translations.timeline}
        lang="EN"
      />,
    )

    const rows = screen.getAllByRole('listitem')
    const [firstRow] = rows

    if (firstRow === undefined) throw new Error('the timeline has no row')

    // Karib IT and Multidao run in parallel, so they share the newest row
    expect(rows).toHaveLength(resume.experiences.length - 1)
    expect(within(firstRow).getAllByRole('article')).toHaveLength(2)
    expect(within(firstRow).getByText('Karib IT SAS')).toBeInTheDocument()
    expect(within(firstRow).getByText('Multidao')).toBeInTheDocument()
  })
})
