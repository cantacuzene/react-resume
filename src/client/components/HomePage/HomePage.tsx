import type { Lang, Resume, SectionTitles, TimelineLabels } from '@/client/api/types'
import { AboutMe } from '@/client/components/AboutMe/AboutMe'
import { Education } from '@/client/components/Education/Education'
import { Languages } from '@/client/components/Languages/Languages'
import { Skills } from '@/client/components/Skills/Skills'
import { Timeline } from '@/client/components/Timeline/Timeline'
import styles from './HomePage.module.css'

export type HomePageProps = Readonly<{
  resume: Resume
  t: SectionTitles
  timeline: TimelineLabels
  lang: Lang
}>

export const HomePage = ({ resume, t, timeline, lang }: HomePageProps) => (
  <main className={styles.main}>
    <div className={styles.about}>
      <AboutMe about={resume.about} title={t.about} />
    </div>
    <div className={styles.skills}>
      <Skills skills={resume.skills} title={t.skills} />
    </div>
    <div className={styles.education}>
      <Education educations={resume.educations} title={t.education} />
    </div>
    <div className={styles.languages}>
      <Languages spokenLanguages={resume.spokenLanguages} title={t.languages} />
    </div>
    <div className={styles.experience}>
      <Timeline experiences={resume.experiences} title={t.experiences} t={timeline} lang={lang} />
    </div>
  </main>
)
