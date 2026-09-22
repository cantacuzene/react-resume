import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

const browserLanguages = (languages: ReadonlyArray<string>) =>
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)

const renderProvider = () =>
  render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  )

describe('LanguageContext', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts in the browser language and syncs the document language', () => {
    browserLanguages(['fr-CA', 'en'])

    renderProvider()

    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'fr')
  })

  it('falls back to English for an unsupported browser language', () => {
    browserLanguages(['ja-JP'])

    renderProvider()

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
  })

  it('prefers the saved language over the browser language', () => {
    browserLanguages(['en-US'])
    localStorage.setItem('lang', 'FR')

    renderProvider()

    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument()
  })

  it('saves a switch so the next visit starts in that language', async () => {
    browserLanguages(['fr'])
    const { unmount } = renderProvider()

    await userEvent.click(screen.getByRole('button', { name: 'FR' }))
    unmount()
    renderProvider()

    expect(localStorage.getItem('lang')).toBe('EN')
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
  })

  it('does not save a detected language', () => {
    browserLanguages(['fr'])

    renderProvider()

    expect(localStorage.getItem('lang')).toBeNull()
  })

  it('keeps working when storage is unavailable', async () => {
    browserLanguages(['fr'])
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })

    renderProvider()
    await userEvent.click(screen.getByRole('button', { name: 'FR' }))

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
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
