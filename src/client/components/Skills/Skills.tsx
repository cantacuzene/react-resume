import { useId } from 'react'
import type { Skill } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './Skills.module.css'
import { radarGeometry } from './Skills.utils'

const SIZE = 400

export type SkillsProps = Readonly<{ skills: ReadonlyArray<Skill>; title: string }>

export const Skills = ({ skills, title }: SkillsProps) => {
  const titleId = useId()
  const { center, axes, rings, polygon, values, labels } = radarGeometry(skills, SIZE)

  return (
    <section className={styles.skills}>
      <SectionTitle text={title} />
      <svg
        role="img"
        aria-labelledby={titleId}
        viewBox={`0 0 ${String(SIZE)} ${String(SIZE)}`}
        className={styles.chart}
      >
        <title id={titleId}>{title}</title>
        {rings.map((points) => (
          <polygon key={points} points={points} className={styles.ring} />
        ))}
        {axes.map(({ x, y }) => (
          <line
            key={`${String(x)},${String(y)}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            className={styles.axis}
          />
        ))}
        <polygon points={polygon} className={styles.values} />
        {values.map(({ x, y, text }) => (
          <circle key={text} cx={x} cy={y} r={4} className={styles.point}>
            <title>{text}</title>
          </circle>
        ))}
        {labels.map(({ x, y, anchor, text }) => (
          <text key={text} x={x} y={y} textAnchor={anchor} className={styles.label}>
            {text}
          </text>
        ))}
      </svg>
    </section>
  )
}
