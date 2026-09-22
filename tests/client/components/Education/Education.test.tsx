import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Education } from '@/client/components/Education/Education'
import { resumePageFixture } from '../../../support/fixtures'

describe('Education', () => {
  it('renders each degree with its year, school and location', () => {
    const { resume } = resumePageFixture('EN')
    render(<Education educations={resume.educations} title="Education" />)

    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByText('Master: Expert in Information Technologies')).toBeInTheDocument()
    expect(screen.getByText('2008')).toBeInTheDocument()
    expect(screen.getAllByText('EPITECH')).toHaveLength(2)
    expect(screen.getAllByText('Paris, France')).toHaveLength(2)
  })
})
