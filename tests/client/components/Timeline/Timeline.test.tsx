import { render, screen } from '@testing-library/react'
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
})
