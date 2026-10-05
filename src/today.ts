import type { Snapshot } from './snapshot'

// Calendar date in Asia/Tokyo, read from a passed-in instant. formatToParts
// gives us the year/month/day the traveller would see on the wall.
const tokyoDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((entry) => entry.type === type)?.value ?? ''
}

/**
 * The index of the Day whose `date` is Today in Asia/Tokyo, or null when the
 * Trip is not on. Pure: `now` is the only clock, so tests control it.
 */
export function findTodayIndex(snapshot: Snapshot, now: Date): number | null {
  const parts = tokyoDate.formatToParts(now)
  const today = `${part(parts, 'year')}-${part(parts, 'month')}-${part(parts, 'day')}`
  const day = snapshot.days.find((entry) => entry.date === today)
  return day ? day.index : null
}
