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
    expect(screen.getByText('Present')).toBeInTheDocument()
  })

  it('puts positions that overlap in time in the same row', () => {
    const { resume, translations } = resumePageFixture('EN')
    const [current] = resume.experiences

    if (current === undefined) throw new Error('fixture has no experience')

    const parallel = { ...current, id: 'parallel', company: 'Side Company', start: '2024-09-01' }

    render(
      <Timeline
        experiences={[...resume.experiences, parallel]}
        title="Experience"
        t={translations.timeline}
        lang="EN"
      />,
    )

    const rows = screen.getAllByRole('listitem')
    const [firstRow] = rows

    if (firstRow === undefined) throw new Error('the timeline has no row')

    // The two ongoing positions overlap, so they share the newest row
    expect(rows).toHaveLength(resume.experiences.length)
    expect(within(firstRow).getAllByRole('article')).toHaveLength(2)
    expect(within(firstRow).getByText(parallel.company)).toBeInTheDocument()
  })
})
