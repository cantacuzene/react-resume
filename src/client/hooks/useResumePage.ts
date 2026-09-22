import { useCallback, useEffect, useState } from 'react'
import { request } from '@/client/api/graphql'
import type { ApiError } from '@/client/api/graphql.utils'
import type { Lang, ResumePageQuery } from '@/client/api/types'
import { ResumePageDocument } from '@/client/gql/graphql'

export type ResumePageState =
  | Readonly<{ status: 'loading' }>
  | Readonly<{ status: 'error'; error: ApiError; retry: () => void }>
  | Readonly<{ status: 'success'; data: ResumePageQuery }>

type Settled =
  Readonly<{ key: string; data: ResumePageQuery }> | Readonly<{ key: string; error: ApiError }>

// State belongs to one request key (language + attempt), so a stale response can never show:
// the derived status is `loading` until the current key settles.
export const useResumePage = (lang: Lang): ResumePageState => {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled | null>(null)
  const key = `${lang}#${String(attempt)}`

  useEffect(() => {
    const controller = new AbortController()
    void request(ResumePageDocument, { lang }, controller.signal).then((result) => {
      if (result.ok) {
        setSettled({ key, data: result.value })
      } else if (result.error.kind !== 'aborted') {
        setSettled({ key, error: result.error })
      }
    })
    return () => {
      controller.abort()
    }
  }, [key, lang])

  const retry = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  if (settled?.key !== key) {
    return { status: 'loading' }
  }
  return 'data' in settled
    ? { status: 'success', data: settled.data }
    : { status: 'error', error: settled.error, retry }
}
