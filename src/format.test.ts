import { describe, expect, it } from 'vitest'
import { formatTripRange, tidyTitle } from './format'

describe('tidyTitle', () => {
  it('removes the space Trello titles carry before commas', () => {
    expect(tidyTitle('Kamakura , Enoshima')).toBe('Kamakura, Enoshima')
  })

  it('collapses repeated spaces and trims', () => {
    expect(tidyTitle(' BKK to TOKYO  🛫 ')).toBe('BKK to TOKYO 🛫')
  })
})

describe('formatTripRange', () => {
  it('spans the first to the last Day with an en dash', () => {
    expect(formatTripRange(['2026-11-24', '2026-11-25', '2026-12-02'])).toBe(
      '24 Nov – 2 Dec · 3 days',
    )
  })
})
