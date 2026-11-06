import immigrationData from './data/immigration.json'
import { formatDayShort } from './format'

/**
 * The Immigration Sheet: one A4 page in English and Japanese for the officer at
 * Narita (ADR 0002). Claude Code writes the data in `data/immigration.json`; the
 * sheet's labels are fixed English + Japanese here, whatever the language toggle
 * says, so they stay out of `i18n.ts`.
 */

export interface Bilingual {
  en: string
  ja: string
}

export interface Flight {
  direction: 'arrival' | 'departure'
  date: string // "2026-11-24"
  time: string | null
  flight: string | null
  from: Bilingual
  to: Bilingual
  todo?: string // what is still missing, in Thai, until Claude Code fills it in
}

export interface Stay {
  checkIn: string
  checkOut: string
  name: Bilingual
  short: Bilingual // area name for the Day by Day table
  address: Bilingual
  phone: string
  todo?: string
}

export interface DaySummary {
  index: number
  en: string
  ja: string
}

export interface ImmigrationData {
  checkedAt: string
  purpose: Bilingual
  flights: Flight[]
  stays: Stay[]
  days: DaySummary[]
}

export const immigration = immigrationData as ImmigrationData

export const labels = {
  title: { en: 'Travel Itinerary', ja: '旅行日程表' },
  purpose: { en: 'Purpose', ja: '目的' },
  period: { en: 'Stay in Japan', ja: '滞在期間' },
  length: { en: 'Length of stay', ja: '滞在日数' },
  flights: { en: 'Flights', ja: '航空便' },
  arrival: { en: 'Arrival', ja: '入国' },
  departure: { en: 'Departure', ja: '出国' },
  stays: { en: 'Stays', ja: '宿泊先' },
  dayByDay: { en: 'Day by Day', ja: '日程' },
  date: { en: 'Date', ja: '日付' },
  plan: { en: 'Plan', ja: '予定' },
  stay: { en: 'Stay', ja: '宿泊' },
  inFlight: { en: 'In flight', ja: '機内' },
  prepared: { en: 'Prepared', ja: '作成日' },
} satisfies Record<string, Bilingual>

const DAY_MS = 24 * 60 * 60 * 1000

function utc(date: string): number {
  return Date.parse(`${date}T00:00:00Z`)
}

export function nights(stay: Stay): number {
  return Math.round((utc(stay.checkOut) - utc(stay.checkIn)) / DAY_MS)
}

export function totalNights(stays: Stay[]): number {
  return stays.reduce((sum, stay) => sum + nights(stay), 0)
}

/** `1 night` / `1泊`. */
export function nightsLabel(count: number): Bilingual {
  return { en: `${count} ${count === 1 ? 'night' : 'nights'}`, ja: `${count}泊` }
}

/** The Stay for the night that starts on `date`: checkIn ≤ date < checkOut. */
export function stayForNight(stays: Stay[], date: string): Stay | null {
  return stays.find((stay) => stay.checkIn <= date && date < stay.checkOut) ?? null
}

/**
 * The last calendar day spent in Japan. A flight that leaves after midnight (01:25 on 2 Dec)
 * belongs to the night before, so the traveller's last day is 1 Dec.
 */
export function lastDayInJapan(flight: Pick<Flight, 'date' | 'time'>): string {
  if (!flight.time || flight.time >= '06:00') return flight.date
  return new Date(utc(flight.date) - DAY_MS).toISOString().slice(0, 10)
}

/** Where the travellers sleep on the night of `date`, for the Day by Day table. */
export function nightLabel(data: ImmigrationData, date: string): Bilingual | null {
  const stay = stayForNight(data.stays, date)
  if (stay) return stay.short
  const departure = data.flights.find((flight) => flight.direction === 'departure')
  return departure && lastDayInJapan(departure) === date ? labels.inFlight : null
}

const dayMonth = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' })
const year = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', year: 'numeric' })

function short(date: string): string {
  return dayMonth.format(new Date(utc(date)))
}

/** A sheet date, always English: `Tue 24 Nov`. */
export function formatSheetDate(date: string): string {
  return formatDayShort(date, 'en')
}

/** `24–25 Nov`, or `27 Nov – 1 Dec` across a month. */
export function formatRange(start: string, end: string): string {
  const [startDay, startMonth] = short(start).split(' ')
  const [endDay, endMonth] = short(end).split(' ')
  return startMonth === endMonth ? `${startDay}–${endDay} ${endMonth}` : `${short(start)} – ${short(end)}`
}

/** Days and nights in Japan, from the arrival flight to the departure flight. */
export function stayLength(data: ImmigrationData): { days: number; nights: number } {
  const arrival = data.flights.find((flight) => flight.direction === 'arrival')
  const departure = data.flights.find((flight) => flight.direction === 'departure')
  if (!arrival || !departure) return { days: 0, nights: 0 }
  const nights = Math.round((utc(lastDayInJapan(departure)) - utc(arrival.date)) / DAY_MS)
  return { days: nights + 1, nights }
}

/** `8 days, 7 nights` / `7泊8日` (Japanese puts nights first). */
export function lengthLabel({ days, nights }: { days: number; nights: number }): Bilingual {
  return { en: `${days} days, ${nights} ${nights === 1 ? 'night' : 'nights'}`, ja: `${nights}泊${days}日` }
}

/** A period with the year: `24 Nov – 1 Dec 2026`. */
export function formatPeriod(first: string, last: string): string {
  return `${short(first)} – ${short(last)} ${year.format(new Date(utc(last)))}`
}

/** Every `todo` still in the file, in sheet order. */
export function todos(data: ImmigrationData): string[] {
  return [...data.flights, ...data.stays].flatMap((item) => (item.todo ? [item.todo] : []))
}

/** Email addresses, yen amounts and reservation-number-like digit runs (Sensitive Details). */
export const SENSITIVE = /[\w.+-]+@[\w-]+\.\w+|[¥￥]|\d[\d,]*\s*円|\d{8,}/
