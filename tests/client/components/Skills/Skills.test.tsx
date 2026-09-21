import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skills } from '@/client/components/Skills/Skills'
import { resumePageFixture } from '../../../support/fixtures'

describe('Skills', () => {
  it('draws a radar chart titled with the section title', () => {
    const { resume } = resumePageFixture('EN')
    render(<Skills skills={resume.skills} title="Skills" />)

    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByText('C# 90%')).toBeInTheDocument()
    expect(screen.getByText('Web Architecture')).toBeInTheDocument()
  })
})
