import type { Lang, ResumePageQuery } from '@/client/api/types'
import { content } from '@/server/content'

// Same format as the server's Date scalar (graphql-scalars DateResolver)
const toIsoDate = (date: Readonly<Date>): string => date.toISOString().slice(0, 10)

export const resumePageFixture = (lang: Lang): ResumePageQuery => {
  const { resume, translations, siteLanguages } = content[lang]

  return {
    resume: {
      ...resume,
      experiences: resume.experiences.map((experience) => ({
        ...experience,
        start: toIsoDate(experience.start),
        end: experience.end ? toIsoDate(experience.end) : null,
      })),
    },
    translations,
    siteLanguages,
  }
}
