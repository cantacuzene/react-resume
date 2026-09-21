import { scaleLinear } from 'd3-scale'
import type { Skill } from '@/client/api/types'

export type Point = Readonly<{ x: number; y: number }>
export type Label = Point & Readonly<{ anchor: 'start' | 'middle' | 'end'; text: string }>
export type RadarGeometry = Readonly<{
  center: number
  axes: ReadonlyArray<Point>
  rings: ReadonlyArray<string>
  polygon: string
  values: ReadonlyArray<Point & Readonly<{ text: string }>>
  labels: ReadonlyArray<Label>
}>

// legacy Highcharts options: pane.size 80%, polygon grid lines
const PANE_RATIO = 0.8
const RING_LEVELS: ReadonlyArray<number> = [25, 50, 75, 100]
const LABEL_OFFSET = 12
const VERTICAL_TOLERANCE = Math.PI / 18

const round = (value: number): number => Math.round(value * 100) / 100 + 0

const angleOf = (index: number, count: number): number => (2 * Math.PI * index) / count

const pointAt = (center: number, radius: number, angle: number): Point => ({
  x: round(center + radius * Math.sin(angle)),
  y: round(center - radius * Math.cos(angle)),
})

const toPoints = (points: ReadonlyArray<Point>): string =>
  points.map(({ x, y }) => `${String(x)},${String(y)}`).join(' ')

const anchorOf = (angle: number): Label['anchor'] => {
  const fromVertical = Math.min(angle % Math.PI, Math.PI - (angle % Math.PI))
  if (fromVertical < VERTICAL_TOLERANCE) {
    return 'middle'
  }
  return angle < Math.PI ? 'start' : 'end'
}

export const radarGeometry = (skills: ReadonlyArray<Skill>, size: number): RadarGeometry => {
  const center = size / 2
  const radius = center * PANE_RATIO
  const scale = scaleLinear().domain([0, 100]).range([0, radius])
  const spokes = skills.map((skill, index) => {
    const angle = angleOf(index, skills.length)
    return { skill, angle, value: pointAt(center, scale(skill.rating), angle) }
  })

  return {
    center,
    axes: spokes.map(({ angle }) => pointAt(center, radius, angle)),
    rings: RING_LEVELS.map((level) =>
      toPoints(spokes.map(({ angle }) => pointAt(center, scale(level), angle))),
    ),
    polygon: toPoints(spokes.map(({ value }) => value)),
    values: spokes.map(({ skill, value }) => ({
      ...value,
      text: `${skill.name} ${String(skill.rating)}%`,
    })),
    labels: spokes.map(({ skill, angle }) => ({
      ...pointAt(center, radius + LABEL_OFFSET, angle),
      anchor: anchorOf(angle),
      text: skill.name,
    })),
  }
}
