import { NextRequest, NextResponse } from 'next/server'

const sessionName = 'mission_control_session'

const base64UrlToBytes = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=')
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
}

async function hasValidSession(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return false
  try {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)))
    const actual = base64UrlToBytes(signature)
    if (expected.length !== actual.length) return false
    let difference = 0
    for (let index = 0; index < expected.length; index += 1) difference |= expected[index] ^ actual[index]
    if (difference !== 0) return false
    const decoded = new TextDecoder().decode(base64UrlToBytes(payload))
    const parsed = JSON.parse(decoded) as { username?: unknown; expiresAt?: unknown }
    return typeof parsed.username === 'string' && typeof parsed.expiresAt === 'number' && parsed.expiresAt > Date.now()
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/api/auth/login') return NextResponse.next()
  const secret = process.env.MISSION_CONTROL_SESSION_SECRET
  if (!secret || new TextEncoder().encode(secret).byteLength < 32) return new NextResponse('Mission Control authentication is not configured.', { status: 503 })
  if (await hasValidSession(request.cookies.get(sessionName)?.value, secret)) return NextResponse.next()

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.search = `?next=${encodeURIComponent(`${request.nextUrl.pathname}${request.nextUrl.search}`)}`
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}