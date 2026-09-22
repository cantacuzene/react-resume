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

const SUPPORTED: ReadonlyArray<Lang> = ['FR', 'EN']
const FALLBACK: Lang = 'EN'

const toLang = (code: string): Lang | undefined =>
  SUPPORTED.find((lang) => lang === code.toUpperCase())

// A BCP 47 tag such as `fr-CA` matches on its primary subtag only.
const primarySubtag = (tag: string): string => tag.replace(/-.*$/su, '')

export const resolveInitialLang = (
  saved: string | null,
  browserLanguages: ReadonlyArray<string>,
): Lang =>
  (saved === null ? undefined : toLang(saved)) ??
  browserLanguages.map((tag) => toLang(primarySubtag(tag))).find((lang) => lang !== undefined) ??
  FALLBACK
