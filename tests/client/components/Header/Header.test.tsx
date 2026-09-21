import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Header } from '@/client/components/Header/Header'
import { useLanguage } from '@/client/i18n/LanguageContext'
import { resumePageFixture } from '../../../support/fixtures'
import { renderWithProviders } from '../../../support/renderWithProviders'

const CurrentLang = () => <output>{useLanguage().lang}</output>

const renderHeader = () => {
  const { resume, translations, siteLanguages } = resumePageFixture('FR')
  return renderWithProviders(
    <>
      <Header
        profile={resume.profile}
        t={translations.header}
        aria={translations.aria}
        languages={siteLanguages}
      />
      <CurrentLang />
    </>,
  )
}

describe('Header', () => {
  it('shows the profile', () => {
    renderHeader()

    expect(screen.getByText('Hugo Cantacuzene')).toBeInTheDocument()
    expect(screen.getByText('Architecte logiciel')).toBeInTheDocument()
    expect(screen.getByText('Schoelcher, Martinique')).toBeInTheDocument()
  })

  it('links to email and every profile', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Écrivez-moi !' })).toHaveAttribute(
      'href',
      'mailto:h.cantacuzene@gmail.com',
    )
    expect(screen.getByRole('link', { name: 'Mon profil GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/cantacuzene',
    )
    expect(screen.getByRole('link', { name: 'Mon profil LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voir mes badges' })).toBeInTheDocument()
  })

  it('offers only the other languages and switches to them', async () => {
    renderHeader()
    const switcher = screen.getByRole('group', { name: 'Changer de langue' })

    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Anglais' }))

    expect(switcher).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('EN')
  })
})
