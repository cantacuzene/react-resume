import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Flag } from '@/client/components/Header/Flag'

describe('Flag', () => {
  it.each(['FR', 'EN'] as const)(
    'is decorative for %s: the button label alone names it',
    (code) => {
      render(
        <button type="button" aria-label="switch">
          <Flag code={code} />
        </button>,
      )

      expect(screen.getByRole('button')).toHaveAccessibleName('switch')
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(screen.queryByRole('graphics-document')).not.toBeInTheDocument()
    },
  )
})
