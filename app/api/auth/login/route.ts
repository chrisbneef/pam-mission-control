import { createHash, scryptSync, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createSession } from '../../../../lib/auth'

const sessionName = 'mission_control_session'
const dummyPasswordHash = `${'00'.repeat(16)}:${scryptSync('invalid-password', Buffer.alloc(16), 64).toString('hex')}`

function authConfigurationIsValid(passwordHash: string | undefined, sessionSecret: string | undefined): passwordHash is string {
  return Boolean(passwordHash && /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash) && sessionSecret && Buffer.byteLength(sessionSecret, 'utf8') >= 32)
}

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
  if (!configuredUsername || !sessionSecret || !authConfigurationIsValid(passwordHash, sessionSecret)) {
    return NextResponse.json({ error: 'Sign-in is not configured.' }, { status: 503 })
  }

  let credentials: { username?: unknown; password?: unknown }
  try {
    credentials = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  const username = typeof credentials.username === 'string' ? credentials.username : ''
  const password = typeof credentials.password === 'string' ? credentials.password : ''
  const passwordValid = passwordMatches(password, passwordHash)
  const usernameValid = safeStringMatches(username, configuredUsername)
  passwordMatches(password, dummyPasswordHash)
  if (!(passwordValid && usernameValid)) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })

  const maxAge = 60 * 60 * 8
  const response = NextResponse.json({ ok: true })
  response.cookies.set(sessionName, createSession(configuredUsername, sessionSecret, Date.now() + maxAge * 1000), {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
