import type { CodegenConfig } from '@graphql-codegen/cli'

const config: Readonly<CodegenConfig> = {
  schema: 'src/server/schema.graphql',
  generates: {
    // Typed documents without the client preset's string-keyed graphql() map
    'src/client/gql/graphql.ts': {
      documents: ['src/client/**/*.graphql'],
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        scalars: { Date: 'string' },
        enumsAsTypes: true,
        useTypeImports: true,
        immutableTypes: true,
      },
    },
    'src/server/gql/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars: { Date: 'Date' },
        enumsAsTypes: true,
        useTypeImports: true,
        immutableTypes: true,
      },
    },
  },
}

export default config
