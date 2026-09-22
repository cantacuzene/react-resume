import { useId } from 'react'
import type { SpokenLanguage } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import { LanguageRing } from './LanguageRing'
import styles from './Languages.module.css'

// legacy LanguageList: a 500 × 190 SVG, rings centred at x = 125 and 333
const WIDTH = 500
const HEIGHT = 190
const RING_SPACING = 208
const FIRST_RING_X = 125

export type LanguagesProps = Readonly<{
  spokenLanguages: ReadonlyArray<SpokenLanguage>
  title: string
}>

export const Languages = ({ spokenLanguages, title }: LanguagesProps) => {
  const titleId = useId()

  return (
    <section className={styles.languages}>
      <SectionTitle text={title} />
      <svg
        role="img"
        aria-labelledby={titleId}
        viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
        className={styles.chart}
      >
        <title id={titleId}>{title}</title>
        {spokenLanguages.map(({ name, rating }, index) => (
          <LanguageRing
            key={name}
            name={name}
            rating={rating}
            height={HEIGHT}
            x={FIRST_RING_X + index * RING_SPACING}
          />
        ))}
      </svg>
    </section>
  )
}
