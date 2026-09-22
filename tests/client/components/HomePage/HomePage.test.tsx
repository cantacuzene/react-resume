import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from '@/client/components/HomePage/HomePage'
import { resumePageFixture } from '../../../support/fixtures'

describe('HomePage', () => {
  it('renders the five sections in the legacy order', () => {
    const { resume, translations } = resumePageFixture('EN')
    render(
      <HomePage
        resume={resume}
        t={translations.sections}
        timeline={translations.timeline}
        lang="EN"
      />,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['About', 'Skills', 'Education', 'Languages', 'Experience'])
  })
})
