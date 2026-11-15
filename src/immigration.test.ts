import { describe, expect, it } from 'vitest'
import immigrationJson from './data/immigration.json'
import {
  formatPeriod,
  formatRange,
  formatSheetDate,
  immigration,
  labels,
  lastDayInJapan,
  lengthLabel,
  nightLabel,
  planSteps,
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

  it('has no placeholder left once every flight and Stay is filled in', () => {
    expect(todos(immigration)).toHaveLength(0)
  })

  it('has the same number of steps in English and Japanese on every Day', () => {
    immigration.days.forEach((day) => {
      expect(day.ja.split('→')).toHaveLength(day.en.split('→').length)
    })
  })
})

describe('planSteps', () => {
  it('pairs each English step with its Japanese step', () => {
    expect(planSteps({ index: 0, en: 'Narita → Hotel', ja: '成田 → ホテル' })).toEqual([
      { en: 'Narita', ja: '成田' },
      { en: 'Hotel', ja: 'ホテル' },
    ])
  })

  it('keeps the Day as one step when the step counts differ', () => {
    const day = { index: 0, en: 'Narita → Hotel', ja: '成田' }
    expect(planSteps(day)).toEqual([{ en: day.en, ja: day.ja }])
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
  it('counts 9 days and 8 nights: the 7 nights in Stays plus the night in flight', () => {
    const length = stayLength(immigration)
    expect(length).toEqual({ days: 9, nights: 8 })
    expect(length.nights).toBe(totalNights(immigration.stays) + 1)
    expect(lengthLabel(length)).toEqual({ en: '9 days, 8 nights', ja: '8泊9日' })
  })
})

describe('lastDayInJapan', () => {
  it('counts a flight after midnight as leaving on the day before', () => {
    expect(lastDayInJapan({ date: '2026-12-02', time: '01:25' })).toBe('2026-12-01')
    expect(lastDayInJapan({ date: '2026-12-01', time: '18:30' })).toBe('2026-12-01')
    expect(lastDayInJapan({ date: '2026-12-01', time: null })).toBe('2026-12-01')
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
    expect(formatPeriod('2026-11-24', '2026-12-02')).toBe('24 Nov – 2 Dec 2026')
  })
})
