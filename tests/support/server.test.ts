import { describe, expect, it, vi } from 'vitest'

describe('MSW test server', () => {
  it('rejects and reports requests that have no handler', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(fetch('http://localhost/unhandled')).rejects.toThrow()
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('without a matching request handler'),
    )

    consoleError.mockRestore()
  })
})
