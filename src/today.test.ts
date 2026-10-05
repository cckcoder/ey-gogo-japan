import { describe, expect, it } from 'vitest'
import { snapshot } from './snapshot'
import { findTodayIndex } from './today'

describe('findTodayIndex', () => {
  it('returns the matching Day index for a time inside the Trip', () => {
    // 2026-11-28T03:00:00Z is 12:00 on 28 Nov in Asia/Tokyo, Day 4.
    expect(findTodayIndex(snapshot, new Date('2026-11-28T03:00:00Z'))).toBe(4)
  })

  it('returns null for a date before the Trip', () => {
    expect(findTodayIndex(snapshot, new Date('2026-11-01T00:00:00Z'))).toBeNull()
  })

  it('returns null for a date after the Trip', () => {
    expect(findTodayIndex(snapshot, new Date('2026-12-10T00:00:00Z'))).toBeNull()
  })

  it('keeps 23:30 JST on Day 0 and flips to Day 1 at 00:30 JST', () => {
    // 2026-11-24T14:30:00Z is 23:30 on 24 Nov JST.
    expect(findTodayIndex(snapshot, new Date('2026-11-24T14:30:00Z'))).toBe(0)
    // 2026-11-24T15:30:00Z is 00:30 on 25 Nov JST.
    expect(findTodayIndex(snapshot, new Date('2026-11-24T15:30:00Z'))).toBe(1)
  })
})
