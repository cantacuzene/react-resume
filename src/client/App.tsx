import { Header } from '@/client/components/Header/Header'
import { HomePage } from '@/client/components/HomePage/HomePage'
import { LoadError } from '@/client/components/LoadError/LoadError'
import { Loading } from '@/client/components/Loading/Loading'
import { useResumePage } from '@/client/hooks/useResumePage'
import { useLanguage } from '@/client/i18n/LanguageContext'

export const App = () => {
  const { lang } = useLanguage()
  const state = useResumePage(lang)

  if (state.status === 'loading') {
    return <Loading lang={lang} />
  }
  if (state.status === 'error') {
    return <LoadError lang={lang} retry={state.retry} />
  }

  const { resume, translations, siteLanguages } = state.data
  return (
    <>
      <Header
        profile={resume.profile}
        t={translations.header}
        aria={translations.aria}
        languages={siteLanguages}
      />
      <HomePage
        resume={resume}
        t={translations.sections}
        timeline={translations.timeline}
        lang={lang}
      />
    </>
  )
}
