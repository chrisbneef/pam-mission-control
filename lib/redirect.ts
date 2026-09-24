export function safeInternalPath(value: string | null): string {
  if (!value) return '/'
  try {
    const decoded = decodeURIComponent(value)
    if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\')) return '/'
    return decoded
  } catch {
    return '/'
  }
}
