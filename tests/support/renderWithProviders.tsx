import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { Lang } from '@/client/api/types'
import { LanguageProvider } from '@/client/i18n/LanguageContext'

export const renderWithProviders = (
  ui: Readonly<ReactElement>,
  { lang = 'FR' }: Readonly<{ lang?: Lang }> = {},
) => render(<LanguageProvider initialLang={lang}>{ui}</LanguageProvider>)
