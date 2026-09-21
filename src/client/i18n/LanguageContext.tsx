import { createContext, type ReactNode, use, useEffect, useMemo, useState } from 'react'
import type { Lang } from '@/client/api/types'

type LanguageContextValue = Readonly<{
  lang: Lang
  setLang: (lang: Lang) => void
}>

export type LanguageProviderProps = Readonly<{ children: ReactNode; initialLang?: Lang }>

const LanguageContext = createContext<LanguageContextValue | null>(null)

export const LanguageProvider = ({ children, initialLang = 'FR' }: LanguageProviderProps) => {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang.toLowerCase())
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang])

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export const useLanguage = (): LanguageContextValue => {
  const value = use(LanguageContext)
  if (value === null) {
    throw new Error('useLanguage must be used inside <LanguageProvider>')
  }
  return value
}
