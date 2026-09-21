// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { sideOf } from '@/client/components/Timeline/Timeline.utils'

describe('sideOf', () => {
  it('alternates, starting on the right', () => {
    expect([0, 1, 2, 3].map(sideOf)).toEqual(['right', 'left', 'right', 'left'])
  })
})
