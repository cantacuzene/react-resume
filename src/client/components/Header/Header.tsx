import { FaEnvelope } from 'react-icons/fa'
import type { AriaLabels, HeaderLabels, Profile, SiteLanguage } from '@/client/api/types'
import { useLanguage } from '@/client/i18n/LanguageContext'
import { otherLanguages } from '@/client/i18n/languages.utils'
import { Flag } from './Flag'
import styles from './Header.module.css'
import { linkIcon } from './Header.utils'

export type HeaderProps = Readonly<{
  profile: Profile
  t: HeaderLabels
  aria: AriaLabels
  languages: ReadonlyArray<SiteLanguage>
}>

export const Header = ({ profile, t, aria, languages }: HeaderProps) => {
  const { lang, setLang } = useLanguage()

  return (
    <header>
      <div className={styles.topMenu}>
        <span>{t.switchTo}</span>
        <div role="group" aria-label={aria.switchLanguage} className={styles.switcher}>
          {otherLanguages(lang, languages).map(({ code, label }) => (
            <button
              key={code}
              type="button"
              aria-label={label}
              className={styles.flag}
              onClick={() => {
                setLang(code)
              }}
            >
              <Flag code={code} />
            </button>
          ))}
        </div>
      </div>
      <nav className={styles.nav}>
        <a
          className={`${styles.link ?? ''} ${styles.email ?? ''}`}
          href={`mailto:${profile.email}`}
        >
          <FaEnvelope aria-hidden className={styles.icon} />
          <span>{t.emailMe}</span>
        </a>
        {profile.links.map(({ kind, url, label }) => {
          const Icon = linkIcon(kind)
          return (
            <a
              key={kind}
              className={`${styles.link ?? ''} ${styles[kind.toLowerCase()] ?? ''}`}
              href={url}
            >
              <Icon aria-hidden className={styles.icon} />
              <span>{label}</span>
            </a>
          )
        })}
        <section className={styles.me}>
          <p>{profile.name}</p>
          <h5>{profile.jobTitle}</h5>
          <i className={styles.location}>{profile.location}</i>
        </section>
      </nav>
    </header>
  )
}
