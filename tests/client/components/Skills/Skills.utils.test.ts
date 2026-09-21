// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { radarGeometry } from '@/client/components/Skills/Skills.utils'

const skills = [
  { name: 'A', rating: 100 },
  { name: 'B', rating: 50 },
  { name: 'C', rating: 0 },
  { name: 'D', rating: 25 },
]

describe('radarGeometry', () => {
  const geometry = radarGeometry(skills, 200)

  it('places one axis per skill, clockwise from 12 o’clock, at 80% of the half size', () => {
    expect(geometry.center).toBe(100)
    expect(geometry.axes).toEqual([
      { x: 100, y: 20 },
      { x: 180, y: 100 },
      { x: 100, y: 180 },
      { x: 20, y: 100 },
    ])
  })

  it('draws four polygon rings', () => {
    expect(geometry.rings).toHaveLength(4)
    expect(geometry.rings[3]).toBe('100,20 180,100 100,180 20,100')
    expect(geometry.rings[1]).toBe('100,60 140,100 100,140 60,100')
  })

  it('draws the skill polygon and value points', () => {
    expect(geometry.polygon).toBe('100,20 140,100 100,100 80,100')
    expect(geometry.values.map(({ text }) => text)).toEqual(['A 100%', 'B 50%', 'C 0%', 'D 25%'])
  })

  it('anchors labels by side', () => {
    expect(geometry.labels.map(({ anchor }) => anchor)).toEqual([
      'middle',
      'start',
      'middle',
      'end',
    ])
    expect(geometry.labels[0]).toMatchObject({ x: 100, y: 8, text: 'A' })
  })
})
