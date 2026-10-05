export type Locale = 'th' | 'en'

// Thai dates use the Gregorian calendar so the year reads 2026, matching the Trip.
const intlLocale: Record<Locale, string> = { th: 'th-TH-u-ca-gregory', en: 'en-GB' }

const bangkokClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function formatter(locale: Locale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(intlLocale[locale], { timeZone: 'UTC', ...options })
}

const formats = {
  dayDate: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
  dayShort: { weekday: 'short', day: 'numeric', month: 'short' },
  dayMonth: { day: 'numeric', month: 'short' },
} satisfies Record<string, Intl.DateTimeFormatOptions>

const cache = new Map<string, Intl.DateTimeFormat>()

function format(date: string, locale: Locale, kind: keyof typeof formats): string {
  const key = `${locale}:${kind}`
  let instance = cache.get(key)
  if (!instance) {
    instance = formatter(locale, formats[kind])
    cache.set(key, instance)
  }
  // Day dates are calendar dates; read them at UTC midnight so no timezone shifts them.
  return instance.format(new Date(`${date}T00:00:00Z`)).replace(/,/g, '')
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((entry) => entry.type === type)?.value ?? ''
}

/** Snapshot timestamp as `YYYY-MM-DD HH:mm (GMT+7)` in Asia/Bangkok. */
export function formatGeneratedAt(iso: string): string {
  const parts = bangkokClock.formatToParts(new Date(iso))
  return `${part(parts, 'year')}-${part(parts, 'month')}-${part(parts, 'day')} ${part(parts, 'hour')}:${part(parts, 'minute')} (GMT+7)`
}

/** A Day's date with year: `Sat 28 Nov 2026` / `ส. 28 พ.ย. 2026`. */
export function formatDayDate(date: string, locale: Locale = 'en'): string {
  return format(date, locale, 'dayDate')
}

/** A Day's date without year: `Tue 24 Nov` / `อ. 24 พ.ย.`. */
export function formatDayShort(date: string, locale: Locale = 'en'): string {
  return format(date, locale, 'dayShort')
}

/** The Trip's span: `24 Nov – 2 Dec · 9 days` / `24 พ.ย. – 2 ธ.ค. · 9 วัน`. */
export function formatTripRange(dates: string[], locale: Locale = 'en'): string {
  const first = dates[0]
  const last = dates[dates.length - 1]
  if (!first || !last) return ''
  const count = locale === 'th' ? `${dates.length} วัน` : `${dates.length} days`
  return `${format(first, locale, 'dayMonth')} – ${format(last, locale, 'dayMonth')} · ${count}`
}

/** A card title as typed in Trello, minus stray spaces: `Kamakura , Enoshima` → `Kamakura, Enoshima`. */
export function tidyTitle(title: string): string {
  return title.replace(/\s+([,.])/g, '$1').replace(/\s{2,}/g, ' ').trim()
}
