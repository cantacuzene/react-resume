import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('test isolation', () => {
  it('renders a main landmark', () => {
    render(<main />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('does not leak the previous test render', () => {
    render(<main />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('stores a value in localStorage', () => {
    localStorage.setItem('lang', 'EN')

    expect(localStorage.getItem('lang')).toBe('EN')
  })

  it('does not leak the previous test localStorage', () => {
    expect(localStorage.getItem('lang')).toBeNull()
  })
})
