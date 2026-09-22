import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'

describe('SectionTitle', () => {
  it('renders a level-2 heading', () => {
    render(<SectionTitle text="Skills" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument()
  })
})
