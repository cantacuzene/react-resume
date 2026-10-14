import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DownloadResume } from '@/client/components/Header/DownloadResume'
import { resumePageFixture } from '../../../support/fixtures'

const { resume, translations } = resumePageFixture('FR')
const data = { resume, translations }

describe('DownloadResume', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('offers the download under its translated label', () => {
    render(<DownloadResume data={data} lang="FR" />)

    expect(screen.getByRole('button', { name: 'Télécharger mon CV' })).toBeEnabled()
  })

  it(
    'builds the PDF and hands it to the browser, named after the person',
    { timeout: 30000 },
    async () => {
      // jsdom's object URLs reject a blob built outside its own realm, and a real click would
      // ask the browser to download: both are the browser edge, stubbed here.
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
      const anchorClick = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(() => undefined)
      render(<DownloadResume data={data} lang="FR" />)

      await userEvent.click(screen.getByRole('button', { name: 'Télécharger mon CV' }))

      // Rendering the real document takes a moment in jsdom
      await waitFor(
        () => {
          expect(anchorClick).toHaveBeenCalledOnce()
        },
        { timeout: 10000 },
      )
      expect(anchorClick.mock.instances[0]).toHaveAttribute(
        'download',
        'hugo-cantacuzene-cv-fr.pdf',
      )
    },
  )

  it('offers a retry when the file cannot be built', async () => {
    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
      throw new Error('object URLs unavailable')
    })
    render(<DownloadResume data={data} lang="FR" />)

    await userEvent.click(screen.getByRole('button', { name: 'Télécharger mon CV' }))

    expect(
      await screen.findByRole('button', { name: 'Téléchargement impossible, réessayer' }),
    ).toBeEnabled()
  })
})
