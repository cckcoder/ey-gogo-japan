import { describe, expect, it } from 'vitest'
import immigrationJson from './data/immigration.json'
import {
  formatPeriod,
  formatRange,
  formatSheetDate,
  immigration,
  labels,
  lengthLabel,
  nightLabel,
  SENSITIVE,
  stayForNight,
  stayLength,
  todos,
  totalNights,
} from './immigration'
import { snapshot } from './snapshot'

describe('immigration.json', () => {
  it('has one Day summary per Day of the Snapshot', () => {
    expect(immigration.days.map((day) => day.index)).toEqual(snapshot.days.map((day) => day.index))
  })

  it('has Stays that do not overlap, 7 nights in all', () => {
    const stays = [...immigration.stays].sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    stays.slice(1).forEach((stay, i) => expect(stay.checkIn >= stays[i]!.checkOut).toBe(true))
    expect(totalNights(immigration.stays)).toBe(7)
  })

  it('holds no Sensitive Details', () => {
    expect(JSON.stringify(immigrationJson)).not.toMatch(SENSITIVE)
    expect(JSON.stringify(labels)).not.toMatch(SENSITIVE)
  })

  it('lists one placeholder per todo', () => {
    expect(todos(immigration)).toHaveLength(3)
  })
})

describe('SENSITIVE', () => {
  it.each(['a.b@gmail.com', '¥ 13,250', '29,810 円', 'TC 99915921500'])('catches %s', (text) => {
    expect(text).toMatch(SENSITIVE)
  })

  it('lets phone numbers and postcodes through', () => {
    expect('+81 50-5864-0363 〒111-0053').not.toMatch(SENSITIVE)
  })
})

describe('stayLength', () => {
  it('counts 8 days and 7 nights in Japan, matching the Stays', () => {
    const length = stayLength(immigration)
    expect(length).toEqual({ days: 8, nights: 7 })
    expect(length.nights).toBe(totalNights(immigration.stays))
    expect(lengthLabel(length)).toEqual({ en: '8 days, 7 nights', ja: '7泊8日' })
  })
})

describe('stayForNight', () => {
  it('finds the Stay whose check-in ≤ date < check-out', () => {
    expect(stayForNight(immigration.stays, '2026-11-26')?.name.en).toBe('Toyoko Inn Fuji Kawaguchiko Ohashi')
    expect(stayForNight(immigration.stays, '2026-11-27')?.name.en).toBe('Hotel Route-Inn Grand Tokyo Asakusabashi')
    expect(stayForNight(immigration.stays, '2026-12-01')).toBeNull()
  })
})

describe('nightLabel', () => {
  it('reads in flight on the departure night and nothing after the Trip', () => {
    expect(nightLabel(immigration, '2026-12-01')).toEqual(labels.inFlight)
    expect(nightLabel(immigration, '2026-12-02')).toBeNull()
    expect(nightLabel(immigration, '2026-11-24')?.en).toBe('Asakusabashi')
  })
})

describe('sheet dates', () => {
  it('formats in English', () => {
    expect(formatSheetDate('2026-11-24')).toBe('Tue 24 Nov')
    expect(formatRange('2026-11-24', '2026-11-25')).toBe('24–25 Nov')
    expect(formatRange('2026-11-27', '2026-12-01')).toBe('27 Nov – 1 Dec')
    expect(formatPeriod('2026-11-24', '2026-12-01')).toBe('24 Nov – 1 Dec 2026')
  })
})
