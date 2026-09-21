import type { CodegenConfig } from '@graphql-codegen/cli'

const config: Readonly<CodegenConfig> = {
  schema: 'src/server/schema.graphql',
  generates: {
    'src/client/gql/': {
      preset: 'client',
      documents: ['src/client/**/*.{ts,tsx}', '!src/client/gql/**'],
      presetConfig: { fragmentMasking: false },
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
