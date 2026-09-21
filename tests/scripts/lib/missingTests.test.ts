// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { missingTests } from '../../../scripts/lib/missingTests'

describe('missingTests', () => {
  it('returns nothing when every client component has its test', () => {
    expect(missingTests(['client/App.tsx'], ['client/App.test.tsx'])).toEqual([])
  })

  it('reports a client component without a test at its mirrored path', () => {
    expect(missingTests(['client/components/Header/Header.tsx'], [])).toEqual([
      {
        source: 'client/components/Header/Header.tsx',
        expectedTest: 'client/components/Header/Header.test.tsx',
      },
    ])
  })

  it('requires tests for client utils files', () => {
    expect(missingTests(['client/components/Skills/Skills.utils.ts'], [])).toEqual([
      {
        source: 'client/components/Skills/Skills.utils.ts',
        expectedTest: 'client/components/Skills/Skills.utils.test.ts',
      },
    ])
  })

  it('does not require tests for plain client modules', () => {
    expect(missingTests(['client/api/graphql.ts', 'client/hooks/useResumePage.ts'], [])).toEqual([])
  })

  it('requires a test for every server module', () => {
    expect(missingTests(['server/yoga.ts', 'server/content/index.ts'], [])).toEqual([
      { source: 'server/yoga.ts', expectedTest: 'server/yoga.test.ts' },
      { source: 'server/content/index.ts', expectedTest: 'server/content/index.test.ts' },
    ])
  })

  it('requires a test for every shared module', () => {
    expect(missingTests(['shared/result.ts'], [])).toEqual([
      { source: 'shared/result.ts', expectedTest: 'shared/result.test.ts' },
    ])
  })

  it('ignores non-TypeScript server files', () => {
    expect(missingTests(['server/schema.graphql'], [])).toEqual([])
  })

  it('exempts entry points, generated code and content data files', () => {
    expect(
      missingTests(
        [
          'client/main.tsx',
          'server/main.ts',
          'server/gql/types.ts',
          'client/gql/graphql.ts',
          'server/content/shared.ts',
          'server/content/fr.ts',
          'server/content/en.ts',
        ],
        [],
      ),
    ).toEqual([])
  })

  it('rejects a test that is not at the mirrored path', () => {
    expect(
      missingTests(['client/components/Header/Header.tsx'], ['client/components/Header.test.tsx']),
    ).toHaveLength(1)
  })
})
