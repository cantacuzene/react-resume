import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from '@/client/components/Loading/Loading'

describe('Loading', () => {
  it.each([
    ['FR', 'Chargement'],
    ['EN', 'Loading'],
  ] as const)('is a busy status labelled in %s', (lang, label) => {
    render(<Loading lang={lang} />)

    expect(screen.getByRole('status', { name: label })).toHaveAttribute('aria-busy', 'true')
  })
})
