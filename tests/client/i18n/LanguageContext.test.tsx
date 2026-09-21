import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageProvider, useLanguage } from '@/client/i18n/LanguageContext'
import { renderWithProviders } from '../../support/renderWithProviders'

const Probe = () => {
  const { lang, setLang } = useLanguage()
  return (
    <button
      type="button"
      onClick={() => {
        setLang('EN')
      }}
    >
      {lang}
    </button>
  )
}

describe('LanguageContext', () => {
  it('defaults to French and syncs the document language', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'fr')
  })

  it('respects initialLang', () => {
    renderWithProviders(<Probe />, { lang: 'EN' })

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
  })

  it('switches language for every consumer', async () => {
    renderWithProviders(<Probe />)

    await userEvent.click(screen.getByRole('button', { name: 'FR' }))

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })

  it('throws outside the provider', () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      'useLanguage must be used inside <LanguageProvider>',
    )
  })
})
