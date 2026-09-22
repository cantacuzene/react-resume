import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Lang } from '@/client/api/types'
import { resolveInitialLang } from '@/client/i18n/languages.utils'

type LanguageContextValue = Readonly<{
  lang: Lang
  setLang: (lang: Lang) => void
}>

export type LanguageProviderProps = Readonly<{ children: ReactNode; initialLang?: Lang }>

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'lang'

// Storage throws in private browsing or when site data is blocked: the choice is then simply
// not remembered.
const readSavedLang = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const saveLang = (lang: Lang): void => {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Not remembered; the switch still applies to this visit.
  }
}

const detectLang = (): Lang => resolveInitialLang(readSavedLang(), navigator.languages)

export const LanguageProvider = ({ children, initialLang }: LanguageProviderProps) => {
  const [lang, setCurrentLang] = useState<Lang>(() => initialLang ?? detectLang())

  // Only an explicit choice is saved, so visitors who never choose keep following their browser.
  const setLang = useCallback((next: Lang) => {
    saveLang(next)
    setCurrentLang(next)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang.toLowerCase())
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export const useLanguage = (): LanguageContextValue => {
  const value = use(LanguageContext)
  if (value === null) {
    throw new Error('useLanguage must be used inside <LanguageProvider>')
  }
  return value
}
