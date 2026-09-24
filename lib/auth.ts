import { createHmac, timingSafeEqual } from 'node:crypto'

type SessionPayload = {
  username: string
  expiresAt: number
}

const encode = (value: string) => Buffer.from(value).toString('base64url')
const decode = (value: string) => Buffer.from(value, 'base64url').toString('utf8')
const sign = (encodedPayload: string, secret: string) => createHmac('sha256', secret).update(encodedPayload).digest('base64url')

export function createSession(username: string, secret: string, expiresAt: number): string {
  const payload = encode(JSON.stringify({ username, expiresAt }))
  return `${payload}.${sign(payload, secret)}`
}

export function verifySession(token: string | undefined, secret: string): { username: string } | null {
  if (!token) return null
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return null
  const expected = sign(payload, secret)
  const actualBytes = Buffer.from(signature)
  const expectedBytes = Buffer.from(expected)
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) return null

  try {
    const parsed = JSON.parse(decode(payload)) as SessionPayload
    if (typeof parsed.username !== 'string' || !Number.isFinite(parsed.expiresAt) || parsed.expiresAt <= Date.now()) return null
    return { username: parsed.username }
  } catch {
    return null
  }
}
