import { describe, expect, it } from 'vitest'
import { checklists, kit, kitTotal, packingTotals, quantities, weather, WEATHER_SCALE } from './packing'

describe('packingTotals', () => {
  it('adds up every item in both scenarios', () => {
    expect(packingTotals(quantities)).toEqual({ wash: 27, noWash: 41 })
  })

  it('never asks for fewer items without a wash', () => {
    for (const item of quantities.flatMap((group) => group.items)) {
      expect(item.noWash).toBeGreaterThanOrEqual(item.wash)
    }
  })
})

describe('kitTotal', () => {
  it('sums the current prices', () => {
    expect(kitTotal(kit)).toBe(3900)
  })
})

describe('checklists', () => {
  it('gives every item a unique id, since ticks are stored by id', () => {
    const ids = checklists.flatMap((list) => list.items.map((item) => item.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('weather', () => {
  it('keeps every range on the drawn scale', () => {
    for (const place of weather) {
      expect(place.low).toBeGreaterThanOrEqual(WEATHER_SCALE.min)
      expect(place.high).toBeLessThanOrEqual(WEATHER_SCALE.max)
      expect(place.low).toBeLessThan(place.high)
    }
  })
})
