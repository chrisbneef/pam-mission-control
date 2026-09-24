import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LoginPage from './page'

describe('LoginPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the safe server configuration diagnostic when sign-in is unavailable', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'Sign-in is not configured: MISSION_CONTROL_PASSWORD_HASH must use the saltHex:derivedKeyHex format.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    render(<LoginPage />)
    await user.type(screen.getByLabelText(/username/i), 'michael')
    await user.type(screen.getByLabelText(/password/i), 'not-a-secret')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(
      await screen.findByText('Sign-in is not configured: MISSION_CONTROL_PASSWORD_HASH must use the saltHex:derivedKeyHex format.'),
    ).toBeInTheDocument()
  })
})
