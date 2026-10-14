import { FaDownload } from 'react-icons/fa'
import type { Lang } from '@/client/api/types'
import { type ResumeDownloadData, useResumeDownload } from '@/client/hooks/useResumeDownload'
import { classNames } from '@/client/styles/classNames.utils'
import styles from './Header.module.css'

export type DownloadResumeProps = Readonly<{ data: ResumeDownloadData; lang: Lang }>

export const DownloadResume = ({ data, lang }: DownloadResumeProps) => {
  const { status, start } = useResumeDownload(data, lang)
  const { downloadResume, downloadFailed } = data.translations.header

  return (
    <button
      type="button"
      className={classNames(styles.link, styles.download)}
      onClick={start}
      disabled={status === 'working'}
      aria-busy={status === 'working'}
    >
      <FaDownload aria-hidden className={styles.icon} />
      <span>{status === 'error' ? downloadFailed : downloadResume}</span>
    </button>
  )
}
