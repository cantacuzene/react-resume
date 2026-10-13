import type { Experience, Lang, TimelineLabels } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './Timeline.module.css'
import { timelineRows } from './Timeline.utils'
import { TimelineRow } from './TimelineRow'

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
      <ol className={styles.timeline}>
        {timelineRows(experiences).map((row) => (
          <TimelineRow
            key={row.map(({ experience }) => experience.id).join('-')}
            row={row}
            t={t}
            lang={lang}
          />
        ))}
      </ol>
    </div>
  </section>
)
