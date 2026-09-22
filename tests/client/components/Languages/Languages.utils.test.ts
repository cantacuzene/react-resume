// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  backgroundArc,
  formatPercent,
  progressArc,
  ringRadii,
} from '@/client/components/Languages/Languages.utils'

describe('ringRadii', () => {
  it('keeps the legacy proportions', () => {
    expect(ringRadii(190)).toEqual({ outer: 85, inner: 65 })
  })
})

describe('arcs', () => {
  const radii = ringRadii(190)

  it('draws the background as a full ring', () => {
    expect(backgroundArc(radii)).toMatch(/^M0,-85A85,85/)
  })

  it('draws longer progress arcs for higher ratings', () => {
    expect(progressArc(radii, 0.5)).not.toBe(progressArc(radii, 1))
    expect(progressArc(radii, 0.5)).toMatch(/^M/)
  })
})

describe('formatPercent', () => {
  it('rounds to a whole percentage', () => {
    expect(formatPercent(0.87)).toBe('87%')
    expect(formatPercent(1)).toBe('100%')
  })
})
