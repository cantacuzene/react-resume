import { en } from '@/server/content/en'
import { fr } from '@/server/content/fr'
import type { Lang, Resume, SiteLanguage, Translations } from '@/server/gql/types'

export type LangContent = Readonly<{
  resume: Resume
  translations: Translations
  siteLanguages: ReadonlyArray<SiteLanguage>
}>

// A Lang added to the schema without content fails `typecheck` here
export const content: Readonly<Record<Lang, LangContent>> = { FR: fr, EN: en }
