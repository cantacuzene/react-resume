import type { Resume } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './AboutMe.module.css'

export type AboutMeProps = Readonly<{ about: Resume['about']; title: string }>

export const AboutMe = ({ about, title }: AboutMeProps) => (
  <section className={styles.about}>
    <SectionTitle text={title} />
    {about.cover.map((paragraph) => (
      <p key={paragraph} className={styles.paragraph}>
        {paragraph}
      </p>
    ))}
    <ul className={styles.interests}>
      {about.interests.map((interest) => (
        <li key={interest}>{interest}</li>
      ))}
    </ul>
  </section>
)
