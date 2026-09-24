type AuthEnvironment = {
  MISSION_CONTROL_USERNAME?: string
  MISSION_CONTROL_PASSWORD_HASH?: string
  MISSION_CONTROL_SESSION_SECRET?: string
}

export function getAuthConfigurationError(environment: AuthEnvironment): string | null {
  if (!environment.MISSION_CONTROL_USERNAME) return 'MISSION_CONTROL_USERNAME is missing.'

  const passwordHash = environment.MISSION_CONTROL_PASSWORD_HASH
  if (!passwordHash || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash)) {
    return 'MISSION_CONTROL_PASSWORD_HASH must use the saltHex:derivedKeyHex format.'
  }

  const sessionSecret = environment.MISSION_CONTROL_SESSION_SECRET
  if (!sessionSecret || Buffer.byteLength(sessionSecret, 'utf8') < 32) {
    return 'MISSION_CONTROL_SESSION_SECRET must be at least 32 bytes.'
  }

  return null
}
