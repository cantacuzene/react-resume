import type { Lang, ResumePageQuery } from '@/client/gql/graphql'

export type { Lang, ResumePageQuery }
export type Resume = ResumePageQuery['resume']
export type Profile = Resume['profile']
export type ProfileLink = Profile['links'][number]
export type Skill = Resume['skills'][number]
export type Education = Resume['educations'][number]
export type Experience = Resume['experiences'][number]
export type SpokenLanguage = Resume['spokenLanguages'][number]
export type Translations = ResumePageQuery['translations']
export type SectionTitles = Translations['sections']
export type HeaderLabels = Translations['header']
export type TimelineLabels = Translations['timeline']
export type AriaLabels = Translations['aria']
export type SiteLanguage = ResumePageQuery['siteLanguages'][number]
