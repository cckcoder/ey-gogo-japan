import { ref, watchEffect } from 'vue'
import type { Locale } from './format'

export type { Locale }

const STORAGE_KEY = 'gogo-locale'

const messages = {
  th: {
    planByDay: 'แผนรายวัน',
    seeAll: 'ดูทั้งหมด',
    itinerary: 'กำหนดการ',
    noPlan: 'ยังไม่มีแผน',
    today: 'วันนี้',
    day: 'Day', // "วันที่ 4" would read as a calendar date
    updatedAt: 'ข้อมูล ณ',
    photoCredits: 'เครดิตภาพ',
    source: 'ที่มา',
    by: 'โดย',
    back: 'กลับหน้าหลัก',
    dayNavigation: 'เปลี่ยนวัน',
    keyboardHint: '← → เปลี่ยนวัน · Esc กลับหน้าหลัก',
    mapLink: 'แผนที่',
    language: 'ภาษา',
  },
  en: {
    planByDay: 'Plan by Day',
    seeAll: 'See all',
    itinerary: 'Itinerary',
    noPlan: 'No plan yet',
    today: 'Today',
    day: 'Day',
    updatedAt: 'Updated',
    photoCredits: 'Photo credits',
    source: 'Source',
    by: 'by',
    back: 'Back to Home',
    dayNavigation: 'Day navigation',
    keyboardHint: '← → to switch Day · Esc for Home',
    mapLink: 'Map',
    language: 'Language',
  },
} satisfies Record<Locale, Record<string, string>>

export type MessageKey = keyof (typeof messages)['th']

function readStored(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'th' || value === 'en' ? value : null
  } catch {
    return null
  }
}

function initialLocale(): Locale {
  const stored = readStored()
  if (stored) return stored
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('th')) return 'th'
  return 'en'
}

/** The UI language. Remembered per device; first visit follows the browser language. */
export const locale = ref<Locale>(initialLocale())

export function setLocale(next: Locale): void {
  locale.value = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Private mode or blocked storage: the choice simply lasts for this visit.
  }
}

export function t(key: MessageKey): string {
  return messages[locale.value][key]
}

if (typeof document !== 'undefined') {
  watchEffect(() => {
    document.documentElement.lang = locale.value
  })
}
