import type { Experience, Lang, TimelineLabels } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './Timeline.module.css'
import { sideOf } from './Timeline.utils'
import { TimelineItem } from './TimelineItem'

export type TimelineProps = Readonly<{
  experiences: ReadonlyArray<Experience>
  title: string
  t: TimelineLabels
  lang: Lang
}>

export const Timeline = ({ experiences, title, t, lang }: TimelineProps) => (
  <section className={styles.experience}>
    <SectionTitle text={title} />
    <div className={styles.container}>
      <div className={styles.timeline}>
        {experiences.map((experience, index) => (
          <TimelineItem
            key={experience.id}
            experience={experience}
            t={t}
            lang={lang}
            side={sideOf(index)}
          />
        ))}
      </div>
    </div>
  </section>
)
