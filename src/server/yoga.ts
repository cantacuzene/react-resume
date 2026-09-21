import { makeExecutableSchema } from '@graphql-tools/schema'
import { createYoga } from 'graphql-yoga'
import type { Config } from '@/server/config.utils'
import { resolvers } from '@/server/resolvers'
import { typeDefs } from '@/server/typeDefs'

const schema = makeExecutableSchema({ typeDefs, resolvers })

// Error masking stays on (Yoga's default): unexpected errors reach clients as "Unexpected error."
export const createServer = (config: Readonly<Pick<Config, 'corsOrigins' | 'graphiql'>>) =>
  createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    graphiql: config.graphiql,
    landingPage: false,
    cors: { origin: [...config.corsOrigins], methods: ['POST'] },
  })
