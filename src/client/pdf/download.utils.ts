import type { Lang } from '@/client/api/types'

const slug = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/(^-)|(-$)/gu, '')

export const resumeFileName = (name: string, lang: Lang): string =>
  `${slug(name)}-cv-${lang.toLowerCase()}.pdf`
