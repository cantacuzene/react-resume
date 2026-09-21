// @vitest-environment node
import { buildSchema, isEnumType, isScalarType } from 'graphql'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { Lang } from '@/server/gql/types'
import { typeDefs } from '@/server/typeDefs'

describe('typeDefs', () => {
  const schema = buildSchema(typeDefs)

  it('exposes the three ResumePage query fields', () => {
    expect(Object.keys(schema.getQueryType()?.getFields() ?? {})).toEqual([
      'resume',
      'translations',
      'siteLanguages',
    ])
  })

  it('declares the FR and EN languages', () => {
    const lang = schema.getType('Lang')

    expect(isEnumType(lang) ? lang.getValues().map(({ name }) => name) : []).toEqual(['FR', 'EN'])
  })

  it('declares a Date scalar', () => {
    expect(isScalarType(schema.getType('Date'))).toBe(true)
  })

  it('generates Lang as a string union', () => {
    // Checked by `tsc` (typecheck): fails to compile if codegen emits an enum
    expectTypeOf<Lang>().toEqualTypeOf<'FR' | 'EN'>()
  })
})
