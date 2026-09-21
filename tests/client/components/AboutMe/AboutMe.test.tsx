import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutMe } from '@/client/components/AboutMe/AboutMe'
import { resumePageFixture } from '../../../support/fixtures'

describe('AboutMe', () => {
  it('renders the cover and the interests', () => {
    const { resume } = resumePageFixture('EN')
    render(<AboutMe about={resume.about} title="About" />)

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText(resume.about.cover[0] ?? '')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(resume.about.interests.length)
  })
})
