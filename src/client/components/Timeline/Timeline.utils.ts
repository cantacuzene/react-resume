import type { Experience } from '@/client/api/types'

export type Side = 'left' | 'right'

export type TimelinePlacement = Readonly<{ experience: Experience; side: Side }>

// One row of the timeline: a single position, or two that ran in parallel
export type TimelineRow = ReadonlyArray<TimelinePlacement>

// The legacy timeline starts on the right (`contentClassName: "right"` on the newest entry)
export const sideOf = (index: number): Side => (index % 2 === 0 ? 'right' : 'left')

// `end: null` is the current position: it runs past every other date (ISO dates compare as text)
const ONGOING = '9999-12-31'

const endOf = ({ end }: Experience): string => end ?? ONGOING

// Positions that only touch (one ends the month the next starts) do not overlap
const overlap = (a: Experience, b: Experience): boolean => a.start < endOf(b) && b.start < endOf(a)

const byStartDesc = (a: Experience, b: Experience): number => b.start.localeCompare(a.start)

// Newest start first, so a pair is `[newer, older]`
type Group = readonly [Experience] | readonly [Experience, Experience]

// Greedy: a position pairs with the next one when they overlap, so the third of three
// overlapping positions falls to the following row.
const groupByOverlap = (experiences: ReadonlyArray<Experience>): ReadonlyArray<Group> => {
  const [first, second, ...rest] = experiences

  if (first === undefined) {
    return []
  }

  if (second !== undefined && overlap(first, second)) {
    return [[first, second], ...groupByOverlap(rest)]
  }

  return [[first], ...groupByOverlap(experiences.slice(1))]
}

// Within a pair the earlier start takes the right side, the main role of the mockup; it also
// renders first, so reading order follows the spine.
const place = (group: Group, index: number): TimelineRow =>
  group.length === 1
    ? [{ experience: group[0], side: sideOf(index) }]
    : [
        { experience: group[1], side: 'right' },
        { experience: group[0], side: 'left' },
      ]

export const timelineRows = (experiences: ReadonlyArray<Experience>): ReadonlyArray<TimelineRow> =>
  groupByOverlap([...experiences].sort(byStartDesc)).map(place)
