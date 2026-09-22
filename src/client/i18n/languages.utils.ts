import { format, parseISO } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import type { Lang, SiteLanguage } from '@/client/api/types'

export const otherLanguages = (
  current: Lang,
  languages: ReadonlyArray<SiteLanguage>,
): ReadonlyArray<SiteLanguage> => languages.filter(({ code }) => code !== current)

const MONTH_FORMATS = {
  FR: { pattern: 'MM/yyyy', locale: fr },
  EN: { pattern: 'MMM yyyy', locale: enUS },
} as const

export const formatMonth = (iso: string, lang: Lang): string => {
  const { pattern, locale } = MONTH_FORMATS[lang]
  return format(parseISO(iso), pattern, { locale })
}
