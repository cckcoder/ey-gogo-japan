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
    darkMode: 'โหมดมืด',
    packing: 'เตรียมของ',
    packingTitle: 'เตรียมของไปญี่ปุ่น',
    // The Packing page title splits so its key word carries the accent:
    // packingTitleLead + packingTitleAccent === packingTitle.
    packingTitleLead: 'เตรียมของไป',
    packingTitleAccent: 'ญี่ปุ่น',
    packingTeaser: 'เสื้อผ้ากี่ชิ้น เช็กลิสต์ และอากาศช่วงที่ไป',
    weather: 'อากาศช่วงที่ไป',
    weatherNote: 'ค่าเฉลี่ยโดยประมาณ ไม่ใช่พยากรณ์ แถบคือช่วงต่ำสุด–สูงสุดบนสเกล 0–30 °C',
    layering: 'แต่งตัวแบบ 3 ชั้น',
    layeringNote: 'ข้างนอกหนาว แต่ในรถไฟและห้างร้อน หลายชั้นบางๆ ถอดใส่ง่ายกว่าเสื้อหนาตัวเดียว',
    howMany: 'ต้องเตรียมกี่ชิ้น',
    howManyNote: 'ผู้ชาย 1 คน 8 คืน นับรวมชุดที่ใส่ขึ้นเครื่อง Toyoko Inn และ Route Inn ส่วนใหญ่มีเครื่องซักผ้าหยอดเหรียญ',
    washOnce: 'ซัก 1 ครั้ง',
    noWash: 'ไม่ซัก',
    item: 'ของ',
    pieces: 'ชิ้น',
    pairs: 'คู่',
    itemsWashOnce: 'ชิ้น/คู่ ถ้าซักผ้า 1 ครั้ง',
    itemsNoWash: 'ชิ้น/คู่ ถ้าไม่ซักเลย',
    byDay: 'สิ่งที่ต้องคิดตามแผนแต่ละวัน',
    checklist: 'เช็กลิสต์',
    checklistNote: 'ติ๊กได้เลย แอปจำไว้ในเครื่องนี้',
    kit: 'ชุดแนะนำจาก Decathlon',
    kitNote: 'เสื้อผ้าผู้ชายจาก decathlon.co.th ราคา ณ',
    kitNoteEnd: 'ราคาอาจเปลี่ยน',
    kitTotal: 'รวม',
    opensInNewTab: 'เปิดในแท็บใหม่',
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
    darkMode: 'Dark mode',
    packing: 'Packing',
    packingTitle: 'Packing for Japan',
    packingTitleLead: 'Packing for ',
    packingTitleAccent: 'Japan',
    packingTeaser: 'How many clothes, a checklist and the weather',
    weather: 'Weather on the Trip',
    weatherNote: 'Rough averages, not a forecast. Bars show low to high on a 0–30 °C scale.',
    layering: 'Dress in three layers',
    layeringNote: 'It is cold outside but trains and shops are heated. Thin layers come off more easily than one thick coat.',
    howMany: 'How many to pack',
    howManyNote: 'For one man over 8 nights, including what he wears on the plane. Most Toyoko Inn and Route Inn hotels have coin laundry.',
    washOnce: 'Wash once',
    noWash: 'No wash',
    item: 'Item',
    pieces: 'pcs',
    pairs: 'pairs',
    itemsWashOnce: 'items if you wash once',
    itemsNoWash: 'items if you never wash',
    byDay: 'Day by Day',
    checklist: 'Checklist',
    checklistNote: 'Tick as you pack. The app remembers on this device.',
    kit: 'Decathlon kit',
    kitNote: "Men's clothing from decathlon.co.th, prices as of",
    kitNoteEnd: 'Prices may change.',
    kitTotal: 'Total',
    opensInNewTab: 'opens in new tab',
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
