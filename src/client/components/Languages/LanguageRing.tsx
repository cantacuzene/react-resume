import { useId } from 'react'
import styles from './Languages.module.css'
import { backgroundArc, formatPercent, progressArc, ringRadii } from './Languages.utils'

export type LanguageRingProps = Readonly<{
  name: string
  rating: number
  height: number
  x: number
}>

// legacy/src/components/LanguageChart.utils.js: rings with inset shadows
export const LanguageRing = ({ name, rating, height, x }: LanguageRingProps) => {
  const shadowId = useId()
  const radii = ringRadii(height)

  return (
    <g transform={`translate(${String(x)}, ${String(height / 2)})`}>
      <defs>
        <filter id={`${shadowId}-outer`}>
          <feOffset dx="0" dy="0" />
          <feGaussianBlur stdDeviation="5" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="grey" floodOpacity="0.5" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
        <filter id={`${shadowId}-inner`}>
          <feOffset dx="0" dy="0" />
          <feGaussianBlur stdDeviation="1" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="white" floodOpacity="0.5" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
      <path d={backgroundArc(radii)} className={styles.track} filter={`url(#${shadowId}-outer)`} />
      <path
        d={progressArc(radii, rating)}
        className={styles.progress}
        filter={`url(#${shadowId}-inner)`}
      />
      <circle r={radii.inner} className={styles.centre} />
      <text textAnchor="middle" className={styles.name}>
        {name}
      </text>
      <text textAnchor="middle" dy="30" className={styles.percent}>
        {formatPercent(rating)}
      </text>
    </g>
  )
}
