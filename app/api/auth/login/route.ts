import { createHash, scryptSync, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getAuthConfigurationError } from '../../../../lib/auth-config'
import { createSession } from '../../../../lib/auth'

const sessionName = 'mission_control_session'
const dummyPasswordHash = `${'00'.repeat(16)}:${scryptSync('invalid-password', Buffer.alloc(16), 64).toString('hex')}`

function passwordMatches(candidate: string, storedHash: string): boolean {
  const [salt, expected] = storedHash.split(':')
  if (!salt || !expected) return false
  const candidateHash = scryptSync(candidate, Buffer.from(salt, 'hex'), 64).toString('hex')
  const candidateBytes = Buffer.from(candidateHash, 'hex')
  const expectedBytes = Buffer.from(expected, 'hex')
  return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes)
}

function safeStringMatches(left: string, right: string): boolean {
  return timingSafeEqual(createHash('sha256').update(left).digest(), createHash('sha256').update(right).digest())
}

export async function POST(request: Request) {
  const configuredUsername = process.env.MISSION_CONTROL_USERNAME
  const passwordHash = process.env.MISSION_CONTROL_PASSWORD_HASH
  const sessionSecret = process.env.MISSION_CONTROL_SESSION_SECRET
  const configurationError = getAuthConfigurationError({
    MISSION_CONTROL_USERNAME: configuredUsername,
    MISSION_CONTROL_PASSWORD_HASH: passwordHash,
    MISSION_CONTROL_SESSION_SECRET: sessionSecret,
  })
  if (configurationError) {
    return NextResponse.json({ error: `Sign-in is not configured: ${configurationError}` }, { status: 503 })
  }
  const validUsername = configuredUsername as string
  const validPasswordHash = passwordHash as string
  const validSessionSecret = sessionSecret as string

  let credentials: { username?: unknown; password?: unknown }
  try {
    credentials = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  const username = typeof credentials.username === 'string' ? credentials.username : ''
  const password = typeof credentials.password === 'string' ? credentials.password : ''
  const passwordValid = passwordMatches(password, validPasswordHash)
  const usernameValid = safeStringMatches(username, validUsername)
  passwordMatches(password, dummyPasswordHash)
  if (!(passwordValid && usernameValid)) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })

  const maxAge = 60 * 60 * 8
  const response = NextResponse.json({ ok: true })
  response.cookies.set(sessionName, createSession(validUsername, validSessionSecret, Date.now() + maxAge * 1000), {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
