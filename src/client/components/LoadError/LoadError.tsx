import { FaRotateRight, FaTriangleExclamation } from 'react-icons/fa6'
import type { Lang } from '@/client/api/types'
import styles from './LoadError.module.css'

// Shown when translations failed to load: documented jsx-no-literals exception
const RETRY_LABELS: Readonly<Record<Lang, string>> = { FR: 'Réessayer', EN: 'Retry' }

export type LoadErrorProps = Readonly<{ lang: Lang; retry: () => void }>

export const LoadError = ({ lang, retry }: LoadErrorProps) => (
  <div role="alert" className={styles.error}>
    <FaTriangleExclamation aria-hidden className={styles.icon} />
    <button type="button" aria-label={RETRY_LABELS[lang]} className={styles.retry} onClick={retry}>
      <FaRotateRight aria-hidden />
    </button>
  </div>
)
