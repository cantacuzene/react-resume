// @vitest-environment node
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { describe, expect, it } from 'vitest'
import { linkIcon } from '@/client/components/Header/Header.utils'

describe('linkIcon', () => {
  it.each([
    ['GITHUB', FaGithub],
    ['LINKEDIN', FaLinkedin],
  ] as const)('maps %s to its icon', (kind, icon) => {
    expect(linkIcon(kind)).toBe(icon)
  })
})
