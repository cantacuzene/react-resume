import type { Lang } from '@/client/api/types'

export type FlagProps = Readonly<{ code: Lang }>

export const Flag = ({ code }: FlagProps) =>
  code === 'FR' ? (
    <svg aria-hidden="true" viewBox="0 0 3 2" width="24" height="16">
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ed2939" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 19 10" width="24" height="16">
      <rect width="19" height="10" fill="#fff" />
      {[0, 2, 4, 6, 8].map((row) => (
        <rect key={row} y={(row * 10) / 13} width="19" height={10 / 13} fill="#b22234" />
      ))}
      {[10, 12].map((row) => (
        <rect key={row} y={(row * 10) / 13} width="19" height={10 / 13} fill="#b22234" />
      ))}
      <rect width="7.6" height={70 / 13} fill="#3c3b6e" />
    </svg>
  )
