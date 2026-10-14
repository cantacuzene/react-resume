import type {
  Education,
  Experience,
  Lang,
  Resume,
  SpokenLanguage,
  Translations,
} from '@/client/api/types'
import { formatPercent } from '@/client/components/Languages/Languages.utils'
import { formatMonth } from '@/client/i18n/languages.utils'

export type ResumeField = Readonly<{ label: string; value: string }>

// An ordered, renderer-agnostic model of the resume: the PDF renderer walks it top to bottom,
// so the text layer comes out in the reading order of the page.
export type ResumeBlock =
  | Readonly<{ kind: 'title'; text: string; subtitle: string; contact: ReadonlyArray<string> }>
  | Readonly<{ kind: 'heading'; text: string }>
  | Readonly<{ kind: 'paragraph'; text: string }>
  | Readonly<{ kind: 'list'; items: ReadonlyArray<string> }>
  | Readonly<{
      kind: 'entry'
      title: string
      subtitle: string
      dates: string
      fields: ReadonlyArray<ResumeField>
    }>

export type ResumeDocumentData = Readonly<{ resume: Resume; translations: Translations }>

const educationEntry = ({ title, school, location, year }: Education): ResumeBlock => ({
  kind: 'entry',
  title,
  subtitle: `${school}, ${location}`,
  dates: String(year),
  fields: [],
})

const experienceDates = ({ start, end }: Experience, present: string, lang: Lang): string =>
  `${formatMonth(start, lang)} - ${end === null ? present : formatMonth(end, lang)}`

const experienceEntry = (
  experience: Experience,
  { timeline }: Translations,
  lang: Lang,
): ResumeBlock => ({
  kind: 'entry',
  title: experience.title,
  subtitle: experience.company,
  dates: experienceDates(experience, timeline.present, lang),
  fields: [
    { label: timeline.description, value: experience.description },
    // Only a position carried out through a company has a mission
    ...(experience.mission === null
      ? []
      : [{ label: timeline.mission, value: experience.mission }]),
    { label: timeline.stack, value: experience.stack.join(', ') },
  ],
})

const languageItem = ({ name, rating }: SpokenLanguage): string =>
  `${name}: ${formatPercent(rating)}`

export const resumeDocument = (
  { resume, translations }: ResumeDocumentData,
  lang: Lang,
): ReadonlyArray<ResumeBlock> => {
  const { profile, about, skills, educations, spokenLanguages, experiences } = resume
  const { sections } = translations

  return [
    {
      kind: 'title',
      text: profile.name,
      subtitle: profile.jobTitle,
      contact: [profile.location, profile.email],
    },
    { kind: 'heading', text: sections.about },
    ...about.cover.map((text): ResumeBlock => ({ kind: 'paragraph', text })),
    { kind: 'list', items: about.interests },
    { kind: 'heading', text: sections.skills },
    { kind: 'list', items: skills.map(({ name, rating }) => `${name}: ${String(rating)}/100`) },
    { kind: 'heading', text: sections.education },
    ...educations.map(educationEntry),
    { kind: 'heading', text: sections.languages },
    { kind: 'list', items: spokenLanguages.map(languageItem) },
    { kind: 'heading', text: sections.experiences },
    ...experiences.map((experience) => experienceEntry(experience, translations, lang)),
  ]
}
