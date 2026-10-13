// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { sideOf, timelineRows } from '@/client/components/Timeline/Timeline.utils'
import type { Experience } from '@/client/api/types'

const experience = (id: string, start: string, end: string | null): Experience => ({
  id,
  title: `Title ${id}`,
  company: `Company ${id}`,
  start,
  end,
  description: `Description ${id}`,
  stack: ['TypeScript'],
})

// [[id, side], …] per row, in render order
const layoutOf = (experiences: ReadonlyArray<Experience>) =>
  timelineRows(experiences).map((row) => row.map(({ experience: { id }, side }) => [id, side]))

describe('sideOf', () => {
  it('alternates, starting on the right', () => {
    expect([0, 1, 2, 3].map(sideOf)).toEqual(['right', 'left', 'right', 'left'])
  })
})

describe('timelineRows', () => {
  it('gives each position its own alternating row when none overlap', () => {
    expect(
      layoutOf([
        experience('c', '2018-01-01', null),
        experience('b', '2015-04-01', '2017-05-01'),
        experience('a', '2014-07-01', '2015-03-01'),
      ]),
    ).toEqual([[['c', 'right']], [['b', 'left']], [['a', 'right']]])
  })

  it('pairs overlapping positions in one row, the earlier start on the right', () => {
    expect(
      layoutOf([experience('main', '2018-01-01', null), experience('side', '2024-09-01', null)]),
    ).toEqual([
      [
        ['main', 'right'],
        ['side', 'left'],
      ],
    ])
  })

  it('keeps alternating the rows that follow a pair', () => {
    expect(
      layoutOf([
        experience('main', '2018-01-01', null),
        experience('side', '2024-09-01', null),
        experience('before', '2015-04-01', '2017-05-01'),
        experience('earlier', '2014-07-01', '2015-03-01'),
      ]),
    ).toEqual([
      [
        ['main', 'right'],
        ['side', 'left'],
      ],
      [['before', 'left']],
      [['earlier', 'right']],
    ])
  })

  it('orders rows by start date, newest first, whatever the input order', () => {
    expect(
      layoutOf([
        experience('old', '2010-04-01', '2014-07-01'),
        experience('new', '2018-01-01', null),
        experience('middle', '2015-04-01', '2017-05-01'),
      ]),
    ).toEqual([[['new', 'right']], [['middle', 'left']], [['old', 'right']]])
  })

  it('does not pair positions that only touch', () => {
    expect(
      layoutOf([
        experience('after', '2017-05-01', '2018-01-01'),
        experience('before', '2015-04-01', '2017-05-01'),
      ]),
    ).toEqual([[['after', 'right']], [['before', 'left']]])
  })

  it('pairs a finished position with an open-ended earlier one', () => {
    expect(
      layoutOf([
        experience('ongoing', '2018-01-01', null),
        experience('side', '2019-06-01', '2021-03-01'),
      ]),
    ).toEqual([
      [
        ['ongoing', 'right'],
        ['side', 'left'],
      ],
    ])
  })

  it('pairs two of three overlapping positions and pushes the third to its own row', () => {
    expect(
      layoutOf([
        experience('a', '2018-01-01', null),
        experience('b', '2019-01-01', null),
        experience('c', '2020-01-01', null),
      ]),
    ).toEqual([
      [
        ['b', 'right'],
        ['c', 'left'],
      ],
      [['a', 'left']],
    ])
  })

  it('has no rows for no positions', () => {
    expect(timelineRows([])).toEqual([])
  })
})
