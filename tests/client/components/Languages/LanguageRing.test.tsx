import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LanguageRing } from '@/client/components/Languages/LanguageRing'

describe('LanguageRing', () => {
  it('labels the ring with the language and its percentage', () => {
    render(
      <svg>
        <LanguageRing name="English" rating={0.87} height={190} x={125} />
      </svg>,
    )

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('87%')).toBeInTheDocument()
  })
})
