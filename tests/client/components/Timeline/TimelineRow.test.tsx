import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineRow } from '@/client/components/Timeline/TimelineRow'
import { resumePageFixture } from '../../../support/fixtures'

const { resume, translations } = resumePageFixture('EN')
const [current, previous] = resume.experiences

if (current === undefined || previous === undefined) {
  throw new Error('fixture has fewer than two experiences')
}

describe('TimelineRow', () => {
  it('renders the single position of the row', () => {
    render(
      <TimelineRow
        row={[{ experience: current, side: 'right' }]}
        t={translations.timeline}
        lang="EN"
      />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText(current.company)).toBeInTheDocument()
  })

  it('renders two parallel positions side by side under one node', () => {
    render(
      <TimelineRow
        row={[
          { experience: current, side: 'right' },
          { experience: previous, side: 'left' },
        ]}
        t={translations.timeline}
        lang="EN"
      />,
    )

    expect(within(screen.getByRole('listitem')).getAllByRole('article')).toHaveLength(2)
  })
})
