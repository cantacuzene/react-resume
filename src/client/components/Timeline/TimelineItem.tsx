import type { Experience, Lang, TimelineLabels } from '@/client/api/types'
import { formatMonth } from '@/client/i18n/languages.utils'
import styles from './Timeline.module.css'
import type { Side } from './Timeline.utils'

export type TimelineItemProps = Readonly<{
  experience: Experience
  t: TimelineLabels
  lang: Lang
  side: Side
}>

export const TimelineItem = ({ experience, t, lang, side }: TimelineItemProps) => (
  <article className={styles.item}>
    <div className={styles.icon} />
    <div className={`${styles.content ?? ''} ${styles[side] ?? ''}`}>
      <h3 className={styles.heading}>
        <span className={styles.title}>{experience.title}</span>
        <span>{experience.company}</span>
        <span className={styles.dates}>
          <span className={styles.start}>{formatMonth(experience.start, lang)}</span>
          <span>{experience.end ? formatMonth(experience.end, lang) : t.present}</span>
        </span>
      </h3>
      <h4 className={styles.label}>{t.description}</h4>
      <p>{experience.description}</p>
      <h4 className={styles.label}>{t.stack}</h4>
      <p>{experience.stack.join(', ')}</p>
    </div>
  </article>
)
