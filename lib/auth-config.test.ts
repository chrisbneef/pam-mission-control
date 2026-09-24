import { describe, expect, it } from 'vitest'
import { getAuthConfigurationError } from './auth-config'

const valid = {
  MISSION_CONTROL_USERNAME: 'michael',
  MISSION_CONTROL_PASSWORD_HASH: `${'a'.repeat(32)}:${'b'.repeat(128)}`,
  MISSION_CONTROL_SESSION_SECRET: 's'.repeat(32),
}

describe('getAuthConfigurationError', () => {
  it('accepts complete, correctly formatted authentication configuration', () => {
    expect(getAuthConfigurationError(valid)).toBeNull()
  })

  it('identifies an invalid password-hash format without exposing its value', () => {
    expect(getAuthConfigurationError({ ...valid, MISSION_CONTROL_PASSWORD_HASH: 'not-a-hash' })).toBe(
      'MISSION_CONTROL_PASSWORD_HASH must use the saltHex:derivedKeyHex format.',
    )
  })

  it('identifies a missing or too-short session secret without exposing its value', () => {
    expect(getAuthConfigurationError({ ...valid, MISSION_CONTROL_SESSION_SECRET: 'short' })).toBe(
      'MISSION_CONTROL_SESSION_SECRET must be at least 32 bytes.',
    )
  })
})
