import { describe, expect, it } from 'vitest'
import { safeInternalPath } from './redirect'

describe('safeInternalPath', () => {
  it('allows application-relative destinations', () => {
    expect(safeInternalPath('/board?lane=active')).toBe('/board?lane=active')
  })

  it('rejects scheme-relative and absolute redirect targets', () => {
    expect(safeInternalPath('//attacker.example')).toBe('/')
    expect(safeInternalPath('/\\attacker.example')).toBe('/')
    expect(safeInternalPath('/%5C%5Cattacker.example')).toBe('/')
    expect(safeInternalPath('https://attacker.example')).toBe('/')
  })
})
