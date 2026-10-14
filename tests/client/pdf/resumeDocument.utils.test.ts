// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resumeDocument } from '@/client/pdf/resumeDocument.utils'
import { resumePageFixture } from '../../support/fixtures'

const { resume, translations } = resumePageFixture('EN')
const blocks = resumeDocument({ resume, translations }, 'EN')

const headings = blocks.flatMap((block) => (block.kind === 'heading' ? [block.text] : []))
const entries = blocks.flatMap((block) => (block.kind === 'entry' ? [block] : []))
const lists = blocks.flatMap((block) => (block.kind === 'list' ? [block.items] : []))

describe('resumeDocument', () => {
  it('opens with the profile', () => {
    expect(blocks[0]).toEqual({
      kind: 'title',
      text: resume.profile.name,
      subtitle: resume.profile.jobTitle,
      contact: [resume.profile.location, resume.profile.email],
    })
  })

  it('keeps the sections in the order of the page', () => {
    const { sections } = translations

    expect(headings).toEqual([
      sections.about,
      sections.skills,
      sections.education,
      sections.languages,
      sections.experiences,
    ])
  })

  it('writes the cover as paragraphs and the interests as a list', () => {
    const paragraphs = blocks.flatMap((block) => (block.kind === 'paragraph' ? [block.text] : []))

    expect(paragraphs).toEqual(resume.about.cover)
    expect(lists[0]).toEqual(resume.about.interests)
  })

  it('turns skill and language ratings into text', () => {
    expect(lists[1]).toContain('C# / .NET (2.x - 10.x+): 90/100')
    expect(lists[2]).toContain('English: 87%')
  })

  it('lists the educations newest first with their school and location', () => {
    expect(entries[0]).toEqual({
      kind: 'entry',
      title: 'Master: Expert in Information Technologies',
      subtitle: 'EPITECH, Paris, France',
      dates: '2008',
      fields: [],
    })
  })

  it('dates an ongoing position with the present label', () => {
    const multidao = entries.find(({ subtitle }) => subtitle === 'Multidao')

    expect(multidao?.dates).toBe(`Sep 2024 - ${translations.timeline.present}`)
  })

  it('gives each position its description, mission and stack under their labels', () => {
    const { timeline } = translations
    const karibIt = entries.find(({ subtitle }) => subtitle === 'Karib IT SAS')
    const karibItExperience = resume.experiences.find(({ company }) => company === 'Karib IT SAS')

    expect(karibIt?.fields).toEqual([
      { label: timeline.description, value: karibItExperience?.description },
      { label: timeline.mission, value: karibItExperience?.mission },
      { label: timeline.stack, value: karibItExperience?.stack.join(', ') },
    ])
  })

  it('omits the mission of a position that has none', () => {
    const zags = entries.find(({ subtitle }) => subtitle === 'Zags!')

    expect(zags?.fields.map(({ label }) => label)).toEqual([
      translations.timeline.description,
      translations.timeline.stack,
    ])
  })

  it('writes the dates and labels in the requested language', () => {
    const french = resumePageFixture('FR')
    const frenchEntries = resumeDocument(
      { resume: french.resume, translations: french.translations },
      'FR',
    ).flatMap((block) => (block.kind === 'entry' ? [block] : []))
    const multidao = frenchEntries.find(({ subtitle }) => subtitle === 'Multidao')

    expect(multidao?.dates).toBe("09/2024 - Aujourd'hui")
  })
})
