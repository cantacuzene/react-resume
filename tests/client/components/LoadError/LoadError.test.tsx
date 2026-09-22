import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoadError } from '@/client/components/LoadError/LoadError'

describe('LoadError', () => {
  it.each([
    ['FR', 'Réessayer'],
    ['EN', 'Retry'],
  ] as const)('retries from a button labelled in %s', async (lang, label) => {
    const retry = vi.fn()
    render(<LoadError lang={lang} retry={retry} />)

    await userEvent.click(screen.getByRole('button', { name: label }))

    expect(retry).toHaveBeenCalledOnce()
  })
})
