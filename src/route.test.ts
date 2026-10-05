import { describe, expect, it } from 'vitest'
import { parseRoute } from './route'

describe('parseRoute', () => {
  it('parses a Day hash to a Day route', () => {
    expect(parseRoute('#/day/4')).toEqual({ name: 'day', index: 4 })
  })

  it('parses Day 0', () => {
    expect(parseRoute('#/day/0')).toEqual({ name: 'day', index: 0 })
  })

  it('falls back to home for an out-of-range Day', () => {
    expect(parseRoute('#/day/99')).toEqual({ name: 'home' })
  })

  it('falls back to home for an unknown hash', () => {
    expect(parseRoute('#/nope')).toEqual({ name: 'home' })
  })

  it('parses the Packing List hash', () => {
    expect(parseRoute('#/packing')).toEqual({ name: 'packing' })
  })

  it('parses an empty hash as home', () => {
    expect(parseRoute('')).toEqual({ name: 'home' })
  })

  it('parses #/ as home', () => {
    expect(parseRoute('#/')).toEqual({ name: 'home' })
  })
})
