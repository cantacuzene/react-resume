// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { missingTests } from '../../../scripts/lib/missingTests'

describe('missingTests', () => {
  it('returns nothing when every component has its test', () => {
    expect(missingTests(['App.tsx'], ['App.test.tsx'])).toEqual([])
  })

  it('reports a component without a test at its mirrored path', () => {
    expect(missingTests(['components/Header/Header.tsx'], [])).toEqual([
      {
        source: 'components/Header/Header.tsx',
        expectedTest: 'components/Header/Header.test.tsx',
      },
    ])
  })

  it('requires tests for utils files', () => {
    expect(missingTests(['components/Skills/Skills.utils.ts'], [])).toEqual([
      {
        source: 'components/Skills/Skills.utils.ts',
        expectedTest: 'components/Skills/Skills.utils.test.ts',
      },
    ])
  })

  it('does not require tests for plain modules', () => {
    expect(missingTests(['api/graphql.ts', 'hooks/useResumePage.ts'], [])).toEqual([])
  })

  it('exempts the entry point and generated code', () => {
    expect(missingTests(['main.tsx', 'gql/Generated.tsx'], [])).toEqual([])
  })

  it('rejects a test that is not at the mirrored path', () => {
    expect(
      missingTests(['components/Header/Header.tsx'], ['components/Header.test.tsx']),
    ).toHaveLength(1)
  })
})
