import { DateResolver } from 'graphql-scalars'
import { content } from '@/server/content'
import type { Resolvers } from '@/server/gql/types'

// Pure: static content, no I/O (docs/guidelines/backend.md)
export const resolvers: Readonly<Resolvers> = {
  Date: DateResolver,
  Query: {
    resume: (_parent, { lang }) => content[lang].resume,
    translations: (_parent, { lang }) => content[lang].translations,
    siteLanguages: (_parent, { lang }) => content[lang].siteLanguages,
  },
}
