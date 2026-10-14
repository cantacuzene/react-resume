// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  blockKey,
  bulletLine,
  contactLine,
  entryHeadline,
  fieldLabel,
} from '@/client/pdf/pdfLines.utils'

describe('pdfLines', () => {
  it('marks a list item with a dash', () => {
    expect(bulletLine('DDD and TDD')).toBe('- DDD and TDD')
  })

  it('joins the contact details with a dash', () => {
    expect(contactLine(['Schoelcher, Martinique', 'me@example.com'])).toBe(
      'Schoelcher, Martinique - me@example.com',
    )
  })

  it('joins an entry title and subtitle with a comma', () => {
    expect(entryHeadline({ title: 'Acting CTO', subtitle: 'Multidao' })).toBe(
      'Acting CTO, Multidao',
    )
  })

  it('ends a field label with a colon and a space', () => {
    expect(fieldLabel({ label: 'Stack', value: 'Nix' })).toBe('Stack: ')
  })

  it('keys a block by its kind and position', () => {
    expect(blockKey({ kind: 'heading', text: 'About' }, 3)).toBe('heading-3')
  })
})
