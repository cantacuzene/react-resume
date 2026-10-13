import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineItem } from '@/client/components/Timeline/TimelineItem'
import { resumePageFixture } from '../../../support/fixtures'

const { resume, translations } = resumePageFixture('FR')
const [current] = resume.experiences
const previous = resume.experiences.find(({ end }) => end !== null)

const withMission = resume.experiences.find(({ mission }) => mission !== null)

describe('TimelineItem', () => {
  it('shows the mission under its own label when there is one', () => {
    if (withMission?.mission === undefined || withMission.mission === null) {
      throw new Error('fixture has no experience with a mission')
    }
    render(
      <TimelineItem experience={withMission} t={translations.timeline} lang="FR" side="right" />,
    )

    expect(screen.getByRole('heading', { name: 'Mission' })).toBeInTheDocument()
    expect(screen.getByText(withMission.mission)).toBeInTheDocument()
  })

  it('omits the mission label when the position has none', () => {
    if (current === undefined) throw new Error('fixture has no experience')
    render(<TimelineItem experience={current} t={translations.timeline} lang="FR" side="right" />)

    expect(screen.queryByRole('heading', { name: 'Mission' })).not.toBeInTheDocument()
  })

  it('shows the current position as ongoing', () => {
    if (current === undefined) throw new Error('fixture has no experience')
    render(<TimelineItem experience={current} t={translations.timeline} lang="FR" side="right" />)

    expect(screen.getByText('09/2024')).toBeInTheDocument()
    expect(screen.getByText("Aujourd'hui")).toBeInTheDocument()
    expect(screen.getByText('Acting CTO')).toBeInTheDocument()
    expect(screen.getByText('Multidao')).toBeInTheDocument()
  })

  it('shows the dates, description and stack under their labels', () => {
    if (previous === undefined) throw new Error('fixture has no experience')
    render(<TimelineItem experience={previous} t={translations.timeline} lang="FR" side="left" />)

    expect(screen.getByText('04/2015')).toBeInTheDocument()
    expect(screen.getByText('05/2017')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Descriptif' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Technologies' })).toBeInTheDocument()
    expect(screen.getByText(previous.stack.join(', '))).toBeInTheDocument()
  })
})
