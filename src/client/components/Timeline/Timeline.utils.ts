export type Side = 'left' | 'right'

// The legacy timeline starts on the right (`contentClassName: "right"` on the newest entry)
export const sideOf = (index: number): Side => (index % 2 === 0 ? 'right' : 'left')
