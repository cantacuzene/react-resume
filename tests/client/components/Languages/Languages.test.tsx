import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Languages } from '@/client/components/Languages/Languages'
import { resumePageFixture } from '../../../support/fixtures'

describe('Languages', () => {
  it('draws one ring per spoken language', () => {
    const { resume } = resumePageFixture('FR')
    render(<Languages spokenLanguages={resume.spokenLanguages} title="Langues" />)

    expect(screen.getByRole('img', { name: 'Langues' })).toBeInTheDocument()
    expect(screen.getByText('Anglais')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
  })
})
