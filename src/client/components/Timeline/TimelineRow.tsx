import type { Lang, TimelineLabels } from '@/client/api/types'
import styles from './Timeline.module.css'
import type { TimelineRow as Row } from './Timeline.utils'
import { TimelineItem } from './TimelineItem'

export type TimelineRowProps = Readonly<{
  row: Row
  t: TimelineLabels
  lang: Lang
}>

// One node on the spine, shared by the one or two positions of the row
export const TimelineRow = ({ row, t, lang }: TimelineRowProps) => (
  <li className={styles.row}>
    <div className={styles.icon} />
    {row.map(({ experience, side }) => (
      <TimelineItem key={experience.id} experience={experience} t={t} lang={lang} side={side} />
    ))}
  </li>
)
