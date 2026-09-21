import type { Lang } from '@/client/api/types'
import styles from './Loading.module.css'

// Shown before translations are loaded: documented jsx-no-literals exception
const LABELS: Readonly<Record<Lang, string>> = { FR: 'Chargement', EN: 'Loading' }

export type LoadingProps = Readonly<{ lang: Lang }>

export const Loading = ({ lang }: LoadingProps) => (
  <div role="status" aria-busy="true" aria-label={LABELS[lang]} className={styles.loading}>
    <span className={styles.spinner} />
  </div>
)
