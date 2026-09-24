import { describe, expect, it } from 'vitest'
import { createSession, verifySession } from './auth'

describe('Mission Control session signatures', () => {
  const secret = 'test-only-session-secret-that-is-long-enough'

  it('accepts a valid signed session', () => {
    const token = createSession('michael', secret, Date.now() + 60_000)

    expect(verifySession(token, secret)).toEqual({ username: 'michael' })
  })

  it('rejects tampered and expired sessions', () => {
    const valid = createSession('michael', secret, Date.now() + 60_000)
    const expired = createSession('michael', secret, Date.now() - 1)

    expect(verifySession(`${valid}x`, secret)).toBeNull()
    expect(verifySession(expired, secret)).toBeNull()
  })
})
