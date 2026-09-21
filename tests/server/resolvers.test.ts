// @vitest-environment node
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql'
import { describe, expect, it } from 'vitest'
import { content } from '@/server/content'
import { resolvers } from '@/server/resolvers'
import { typeDefs } from '@/server/typeDefs'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const run = (source: string, lang: string) => graphql({ schema, source, variableValues: { lang } })

describe('resolvers', () => {
  it.each(['FR', 'EN'] as const)('returns the %s section titles', async (lang) => {
    const result = await run(
      'query ($lang: Lang!) { translations(lang: $lang) { sections { about } } }',
      lang,
    )

    expect(result).toEqual({
      data: { translations: { sections: { about: content[lang].translations.sections.about } } },
    })
  })

  it('returns the requested language profile', async () => {
    const result = await run(
      'query ($lang: Lang!) { resume(lang: $lang) { profile { jobTitle } } }',
      'FR',
    )

    expect(result).toEqual({
      data: { resume: { profile: { jobTitle: content.FR.resume.profile.jobTitle } } },
    })
  })

  it('returns the site languages labelled in the requested language', async () => {
    const result = await run(
      'query ($lang: Lang!) { siteLanguages(lang: $lang) { code label } }',
      'EN',
    )

    expect(result).toEqual({ data: { siteLanguages: content.EN.siteLanguages } })
  })

  it('serializes dates as ISO date strings', async () => {
    const result = await run(
      'query ($lang: Lang!) { resume(lang: $lang) { experiences { id start end } } }',
      'EN',
    )

    expect(result.data?.resume).toMatchObject({
      experiences: expect.arrayContaining([{ id: '5', start: '2018-01-01', end: null }]) as unknown,
    })
  })
})
