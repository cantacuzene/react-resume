import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { App } from '@/client/App'
import { renderWithProviders } from '../support/renderWithProviders'
import { server } from '../support/server'

describe('App', () => {
  it('loads the resume in French', async () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('status', { name: 'Chargement' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'À propos' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(5)
  })

  it('switches everything to English', async () => {
    renderWithProviders(<App />)

    await userEvent.click(await screen.findByRole('button', { name: 'Anglais' }))

    expect(await screen.findByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(screen.getByRole('button', { name: 'French' })).toBeInTheDocument()
  })

  it('recovers from a failed load', async () => {
    server.use(
      graphql.query('ResumePage', () => HttpResponse.json({}, { status: 500 }), { once: true }),
    )
    renderWithProviders(<App />)

    await userEvent.click(await screen.findByRole('button', { name: 'Réessayer' }))

    expect(await screen.findByRole('heading', { name: 'À propos' })).toBeInTheDocument()
  })
})
