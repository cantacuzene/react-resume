import { useCallback, useState } from 'react'
import type { Lang, Resume, Translations } from '@/client/api/types'
import { resumeFileName } from '@/client/pdf/download.utils'
import { resumeDocument } from '@/client/pdf/resumeDocument.utils'
import { saveFile } from '@/client/pdf/saveFile'

export type DownloadStatus = 'idle' | 'working' | 'error'

export type ResumeDownload = Readonly<{ status: DownloadStatus; start: () => void }>

export type ResumeDownloadData = Readonly<{ resume: Resume; translations: Translations }>

export const useResumeDownload = (data: ResumeDownloadData, lang: Lang): ResumeDownload => {
  const [status, setStatus] = useState<DownloadStatus>('idle')

  const start = useCallback(() => {
    setStatus('working')
    // The renderer is heavy, so it is fetched the first time someone asks for the file
    import('@/client/pdf/renderResumePdf')
      .then(({ renderResumePdf }) =>
        renderResumePdf(resumeDocument(data, lang), data.resume.profile.name),
      )
      .then((blob) => {
        saveFile(blob, resumeFileName(data.resume.profile.name, lang))
        setStatus('idle')
      })
      .catch(() => {
        // Never throws: a failed download is a state, like every other error in the client
        setStatus('error')
      })
  }, [data, lang])

  return { status, start }
}
