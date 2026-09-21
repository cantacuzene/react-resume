import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,tsx}'],
      setupFiles: ['tests/support/setup.ts'],
      server: {
        deps: {
          // graphql ships a separate development build: run every package that imports graphql
          // through Vite so tests load one copy (otherwise: "GraphQLSchema from another realm")
          inline: [/graphql/, /@envelop\//],
        },
      },
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/client/main.tsx', 'src/server/main.ts', 'src/*/gql/**'],
        thresholds: { lines: 90, branches: 90 },
      },
    },
  }),
)
