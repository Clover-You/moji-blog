import { describe, expect, it } from 'vitest'
import { appendStrPrefix } from './article'

describe('article util', () => {
  it('format duration', () => {
    expect(appendStrPrefix('110min', ' · ')).toBe(' · 110min')
    expect(appendStrPrefix(undefined, ' · ')).toBeFalsy()
    expect(appendStrPrefix('12min', ' # ')).toBe(' # 12min')
  })
})
