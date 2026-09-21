import { arc } from 'd3-shape'

export type RingRadii = Readonly<{ outer: number; inner: number }>

// legacy/src/components/LanguageChart.utils.js
export const ringRadii = (height: number): RingRadii => {
  const outer = height / 2 - 10
  return { outer, inner: outer - 20 }
}

// Without a canvas context, d3 arc generators always return the SVG path string (never null)
export const backgroundArc = ({ outer, inner }: RingRadii): string =>
  arc()({ innerRadius: inner, outerRadius: outer, startAngle: 0, endAngle: 2 * Math.PI }) as string

export const progressArc = ({ outer, inner }: RingRadii, rating: number): string =>
  arc().cornerRadius(20)({
    innerRadius: inner,
    outerRadius: outer,
    startAngle: -0.05,
    endAngle: 2 * Math.PI * rating,
  }) as string

export const formatPercent = (rating: number): string => `${String(Math.round(rating * 100))}%`
