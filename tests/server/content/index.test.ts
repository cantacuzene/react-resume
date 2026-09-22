// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { content, type LangContent } from '@/server/content'

type Leaf = Readonly<{ path: string; value: unknown }>

const leaves = (value: unknown, path: string): ReadonlyArray<Leaf> => {
  if (Array.isArray(value)) {
    return value.flatMap((item: unknown, index) => leaves(item, `${path}[${String(index)}]`))
  }
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    return Object.entries(value).flatMap(([key, child]) => leaves(child, `${path}.${key}`))
  }
  return [{ path, value }]
}

const isUtcMonthStart = (date: Readonly<Date>): boolean =>
  date.getUTCDate() === 1 &&
  date.getUTCHours() === 0 &&
  date.getUTCMinutes() === 0 &&
  date.getUTCSeconds() === 0 &&
  date.getUTCMilliseconds() === 0

const { FR: fr, EN: en } = content

describe('content', () => {
  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('has no empty or blank string in %s', (lang, langContent) => {
    const blank = leaves(langContent, lang)
      .filter(({ value }) => typeof value === 'string' && value.trim() === '')
      .map(({ path }) => path)

    expect(blank).toEqual([])
  })

  it('labels the timeline fields in both languages', () => {
    expect(fr.translations.timeline).toEqual({
      present: "Aujourd'hui",
      description: 'Descriptif',
      stack: 'Technologies',
    })
    expect(en.translations.timeline).toEqual({
      present: 'Present',
      description: 'Description',
      stack: 'Stack',
    })
  })

  it('lists the same experiences and educations in both languages', () => {
    expect(fr.resume.experiences.map(({ id }) => id)).toEqual(
      en.resume.experiences.map(({ id }) => id),
    )
    expect(fr.resume.educations.map(({ id }) => id)).toEqual(
      en.resume.educations.map(({ id }) => id),
    )
  })

  it('translates every translatable string', () => {
    const translatable = (langContent: LangContent): ReadonlyArray<Leaf> => [
      ...leaves(langContent.translations, 'translations'),
      ...leaves(
        langContent.siteLanguages.map(({ label }) => label),
        'siteLanguages.label',
      ),
      ...leaves(langContent.resume.profile.jobTitle, 'profile.jobTitle'),
      ...leaves(
        langContent.resume.profile.links.map(({ label }) => label),
        'links.label',
      ),
      ...leaves(langContent.resume.about, 'about'),
      ...leaves(
        langContent.resume.educations.map(({ title }) => title),
        'educations.title',
      ),
      ...leaves(
        langContent.resume.experiences.map(({ title }) => title),
        'experiences.title',
      ),
      ...leaves(
        langContent.resume.experiences.map(({ description }) => description),
        'experiences.description',
      ),
      ...leaves(
        langContent.resume.spokenLanguages.map(({ name }) => name),
        'spokenLanguages',
      ),
    ]
    const frenchByPath = new Map(translatable(fr).map(({ path, value }) => [path, value]))
    const untranslated = translatable(en)
      .filter(({ path, value }) => frenchByPath.get(path) === value)
      .map(({ path }) => path)

    expect(untranslated).toEqual([])
  })

  it('translates the multi-word skill names', () => {
    const frenchNames = fr.resume.skills.map(({ name }) => name)

    expect(frenchNames).toContain('Architecture hexagonale')
    expect(frenchNames).toContain('Architecture web')
  })

  it('lists the same skills, spoken languages and links in both languages', () => {
    expect(fr.resume.skills.map(({ rating }) => rating)).toEqual(
      en.resume.skills.map(({ rating }) => rating),
    )
    expect(fr.resume.spokenLanguages).toHaveLength(en.resume.spokenLanguages.length)
    expect(fr.resume.profile.links.map(({ kind }) => kind)).toEqual(
      en.resume.profile.links.map(({ kind }) => kind),
    )
  })

  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('uses UTC month starts and ordered dates in %s', (_lang, langContent) => {
    langContent.resume.experiences.forEach(({ start, end }) => {
      expect(isUtcMonthStart(start)).toBe(true)
      if (end !== null && end !== undefined) {
        expect(isUtcMonthStart(end)).toBe(true)
        expect(end.getTime()).toBeGreaterThanOrEqual(start.getTime())
      }
    })
  })

  it('has exactly one current position', () => {
    expect(en.resume.experiences.filter(({ end }) => end === null)).toHaveLength(1)
  })

  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('keeps ratings in range in %s', (_lang, langContent) => {
    langContent.resume.skills.forEach(({ rating }) => {
      expect(rating).toBeGreaterThanOrEqual(0)
      expect(rating).toBeLessThanOrEqual(100)
    })
    langContent.resume.spokenLanguages.forEach(({ rating }) => {
      expect(rating).toBeGreaterThanOrEqual(0)
      expect(rating).toBeLessThanOrEqual(1)
    })
  })

  it.each([
    ['FR', fr],
    ['EN', en],
  ] as const)('offers every site language in %s', (_lang, langContent) => {
    expect(langContent.siteLanguages.map(({ code }) => code).toSorted()).toEqual(['EN', 'FR'])
  })
})
