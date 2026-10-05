import type { Locale } from './format'

/**
 * The Packing List: what to bring for this Trip, written by Claude Code from the
 * Published Cards (late-November weather, the rental car on Day 1–3, the walking
 * days). It is app content, not part of the Snapshot, so it lives here in both
 * languages rather than in `i18n.ts`, which holds the short UI strings.
 */

export type Text = Record<Locale, string>

export function pick(text: Text, locale: Locale): string {
  return text[locale]
}

export interface Place {
  name: Text
  days: string
  low: number
  high: number
  note: Text
}

/** Rough late-November averages in °C. Not a forecast. */
export const weather: Place[] = [
  {
    name: { th: 'ฟูจิ · คาวากุจิโกะ', en: 'Fuji · Kawaguchiko' },
    days: 'Day 1–3',
    low: 1,
    high: 12,
    note: {
      th: 'เช้ามืดใกล้ 0 °C ลมแรงริมทะเลสาบ หนาวที่สุดของทริป',
      en: 'Near 0 °C before dawn and windy by the lakes. The coldest part of the Trip.',
    },
  },
  {
    name: { th: 'โตเกียว', en: 'Tokyo' },
    days: 'Day 0, 4, 6, 7',
    low: 7,
    high: 15,
    note: {
      th: 'กลางวันสบาย กลางคืนเย็น ในรถไฟและห้างเปิดฮีตเตอร์ร้อน',
      en: 'Mild by day, cold at night. Trains and shops are heated.',
    },
  },
  {
    name: { th: 'คามาคุระ · เอโนชิมะ', en: 'Kamakura · Enoshima' },
    days: 'Day 5',
    low: 8,
    high: 16,
    note: {
      th: 'ริมทะเล ลมแรง และเดินขึ้นบันไดเยอะ',
      en: 'By the sea, windy, with many steps.',
    },
  },
]

/** The scale the weather bars are drawn on. */
export const WEATHER_SCALE = { min: 0, max: 30 }

export const layers: { name: Text; text: Text }[] = [
  {
    name: { th: 'ชั้นใน', en: 'Base' },
    text: {
      th: 'เสื้อและกางเกงตัวในที่เก็บความอุ่น (thermal หรือ merino) จำเป็นจริงๆ เฉพาะ Day 1–3 ที่ฟูจิ',
      en: 'A thermal or merino top and leggings. Needed mainly on Day 1–3 at Fuji.',
    },
  },
  {
    name: { th: 'ชั้นกลาง', en: 'Mid' },
    text: {
      th: 'ฟลีซ ใส่ทุกวัน เป็นชิ้นที่ใช้บ่อยที่สุด',
      en: 'A fleece, worn every day. The piece you will use most.',
    },
  },
  {
    name: { th: 'ชั้นนอก', en: 'Outer' },
    text: {
      th: 'แจ็กเก็ตขนเป็ดหรือบุนวมที่พับเก็บได้ และเสื้อกันลมกันฝนบางๆ อีกตัว',
      en: 'A packable down or padded jacket, plus a thin wind and rain shell.',
    },
  },
]

export type Unit = 'piece' | 'pair'

export interface QuantityItem {
  name: Text
  /** How many to pack if you wash once mid-Trip. */
  wash: number
  /** How many to pack if you never wash. */
  noWash: number
  unit: Unit
  note?: Text
}

export interface QuantityGroup {
  name: Text
  items: QuantityItem[]
}

/** For one man over 8 nights, counting what he wears on the plane. */
export const quantities: QuantityGroup[] = [
  {
    name: { th: 'ชั้นนอก', en: 'Outer' },
    items: [
      {
        name: { th: 'แจ็กเก็ตขนเป็ดหรือบุนวม', en: 'Down or padded jacket' },
        wash: 1,
        noWash: 1,
        unit: 'piece',
        note: { th: 'ใส่ขึ้นเครื่อง', en: 'Wear it on the plane' },
      },
      {
        name: { th: 'เสื้อกันลม/กันฝนบาง', en: 'Thin wind and rain shell' },
        wash: 1,
        noWash: 1,
        unit: 'piece',
        note: { th: 'พับเก็บในเป้ทุกวัน', en: 'Keep it in your daypack' },
      },
    ],
  },
  {
    name: { th: 'ชั้นกลาง', en: 'Mid' },
    items: [
      {
        name: { th: 'ฟลีซหรือสเวตเตอร์', en: 'Fleece or sweater' },
        wash: 2,
        noWash: 2,
        unit: 'piece',
        note: { th: 'สลับใส่', en: 'Swap between them' },
      },
    ],
  },
  {
    name: { th: 'ชั้นใน', en: 'Base' },
    items: [
      {
        name: { th: 'เสื้อตัวใน thermal/merino', en: 'Thermal or merino top' },
        wash: 2,
        noWash: 3,
        unit: 'piece',
        note: { th: 'ใช้หลักๆ Day 1–3', en: 'Mainly Day 1–3' },
      },
      {
        name: { th: 'กางเกงตัวใน thermal', en: 'Thermal leggings' },
        wash: 1,
        noWash: 2,
        unit: 'piece',
        note: { th: 'ใส่ใต้กางเกงยาว Day 1–3', en: 'Under trousers on Day 1–3' },
      },
      {
        name: { th: 'เสื้อยืดหรือเสื้อแขนยาว', en: 'T-shirt or long-sleeve top' },
        wash: 4,
        noWash: 7,
        unit: 'piece',
      },
    ],
  },
  {
    name: { th: 'กางเกง', en: 'Trousers' },
    items: [
      {
        name: { th: 'กางเกงขายาว', en: 'Long trousers' },
        wash: 2,
        noWash: 3,
        unit: 'piece',
        note: { th: 'กางเกงเดินป่า 1 + ยีนส์หรือชิโน่ 1', en: 'One hiking pair, one jeans or chinos' },
      },
    ],
  },
  {
    name: { th: 'ของเล็ก', en: 'Small things' },
    items: [
      {
        name: { th: 'กางเกงใน', en: 'Underwear' },
        wash: 5,
        noWash: 9,
        unit: 'piece',
        note: { th: 'เผื่อเช้าที่ถึงกรุงเทพ', en: 'One spare for landing in Bangkok' },
      },
      {
        name: { th: 'ถุงเท้าหนา (ขนสัตว์)', en: 'Warm wool socks' },
        wash: 2,
        noWash: 3,
        unit: 'pair',
        note: { th: 'Day 1–3', en: 'Day 1–3' },
      },
      { name: { th: 'ถุงเท้าธรรมดา', en: 'Everyday socks' }, wash: 3, noWash: 6, unit: 'pair' },
      {
        name: { th: 'ถุงมือ', en: 'Gloves' },
        wash: 1,
        noWash: 1,
        unit: 'pair',
        note: { th: 'ใช้จอมือถือได้', en: 'Touchscreen-friendly' },
      },
      { name: { th: 'หมวกไหมพรม', en: 'Beanie' }, wash: 1, noWash: 1, unit: 'piece' },
      {
        name: { th: 'ผ้าพันคอหรือปลอกคอ', en: 'Scarf or neck warmer' },
        wash: 1,
        noWash: 1,
        unit: 'piece',
        note: { th: 'ไม่บังคับ', en: 'Optional' },
      },
      {
        name: { th: 'รองเท้าผ้าใบที่เดินสบาย', en: 'Comfortable trainers' },
        wash: 1,
        noWash: 1,
        unit: 'pair',
        note: { th: 'ใส่ขึ้นเครื่อง', en: 'Wear them on the plane' },
      },
    ],
  },
]

export function packingTotals(groups: QuantityGroup[]): { wash: number; noWash: number } {
  const items = groups.flatMap((group) => group.items)
  return {
    wash: items.reduce((sum, item) => sum + item.wash, 0),
    noWash: items.reduce((sum, item) => sum + item.noWash, 0),
  }
}

export const dayTips: { days: string; text: Text }[] = [
  {
    days: 'Day 0',
    text: {
      th: 'ลงนาริตะ 15:05 แล้วนั่งรถไฟต่อเลย เก็บฟลีซหรือแจ็กเก็ตไว้ในกระเป๋าถือขึ้นเครื่อง',
      en: 'Land at Narita at 15:05 and take the train straight on. Keep a fleece or jacket in your carry-on.',
    },
  },
  {
    days: 'Day 1',
    text: {
      th: 'รับรถ Toyota 10:30 ต้องมีใบขับขี่สากล ใบขับขี่ไทยตัวจริง และพาสปอร์ต ที่น้ำตกชิไรโตะมีละอองน้ำ ใส่เสื้อกันลม',
      en: 'Car pick-up at 10:30 needs an International Driving Permit, your Thai licence and passport. Shiraito Falls is misty, so wear the shell.',
    },
  },
  {
    days: 'Day 2',
    text: {
      th: 'วนห้าทะเลสาบ ออก 8:30 เช้าหนาวที่สุดของทริป ใส่ครบ 3 ชั้น พร้อมถุงมือและหมวก',
      en: 'The five-lakes drive leaves at 8:30, the coldest morning of the Trip. Wear all three layers, gloves and a beanie.',
    },
  },
  {
    days: 'Day 3',
    text: {
      th: 'คืนรถ 11:30 แล้วนั่ง Highway Bus กลับโตเกียวพร้อมกระเป๋าใหญ่ กระเป๋าเบาจะช่วยได้มาก',
      en: 'Return the car at 11:30, then the highway bus to Tokyo with all your luggage. Pack light.',
    },
  },
  {
    days: 'Day 4',
    text: {
      th: 'วันที่เดินเยอะที่สุด ใส่รองเท้าที่เดินสบายและเคยใส่เดินมาแล้ว ใช้ Suica บนมือถือ',
      en: 'The longest walking day. Wear shoes you have already broken in, and use Suica on your phone.',
    },
  },
  {
    days: 'Day 5',
    text: {
      th: 'เอโนชิมะมีบันไดเยอะ ริมทะเลลมแรง ใส่เสื้อกันลมทับฟลีซ',
      en: 'Enoshima has many steps and a sea wind. Wear the shell over your fleece.',
    },
  },
  {
    days: 'Day 6',
    text: {
      th: 'ช็อปลดภาษีต้องพกพาสปอร์ตตัวจริง เตรียมกระเป๋าพับไว้ใส่ของฝาก',
      en: 'Tax-free shopping needs your passport. Bring a foldable bag for souvenirs.',
    },
  },
  {
    days: 'Day 7–8',
    text: {
      th: 'ชั่งกระเป๋าก่อนออกจากโรงแรม ใส่แจ็กเก็ตขึ้นเครื่อง ถึงกรุงเทพ 6:30',
      en: 'Weigh your bags before leaving the hotel and wear the jacket on board. You land in Bangkok at 6:30.',
    },
  },
]

export interface ChecklistItem {
  /** Stable id: ticks are stored by it, so never reuse one for a different item. */
  id: string
  label: Text
  note?: Text
}

export interface Checklist {
  title: Text
  items: ChecklistItem[]
}

export const checklists: Checklist[] = [
  {
    title: { th: 'เอกสารและเงิน', en: 'Documents and money' },
    items: [
      {
        id: 'passport',
        label: { th: 'พาสปอร์ต', en: 'Passport' },
        note: { th: 'อายุเหลือเกิน 6 เดือน', en: 'Valid for more than 6 months' },
      },
      {
        id: 'idp',
        label: { th: 'ใบขับขี่สากล + ใบขับขี่ไทยตัวจริง', en: 'International Driving Permit + Thai licence' },
        note: { th: 'ไม่มีจะรับรถวันที่ 25 พ.ย. ไม่ได้', en: 'Without them there is no car on 25 Nov' },
      },
      {
        id: 'vjw',
        label: { th: 'ลงทะเบียน Visit Japan Web', en: 'Register on Visit Japan Web' },
        note: { th: 'ได้ QR สำหรับตรวจคนเข้าเมืองและศุลกากร', en: 'Gives you the immigration and customs QR codes' },
      },
      { id: 'insurance', label: { th: 'ประกันการเดินทาง', en: 'Travel insurance' } },
      {
        id: 'yen',
        label: { th: 'เงินสดเยน', en: 'Yen in cash' },
        note: { th: 'ร้านเล็กหลายร้านรับแต่เงินสด', en: 'Many small places take cash only' },
      },
      { id: 'card', label: { th: 'บัตรที่ใช้ต่างประเทศได้', en: 'A card that works abroad' } },
      {
        id: 'suica',
        label: { th: 'Suica บนมือถือ', en: 'Suica on your phone' },
        note: { th: 'เพิ่มใน Wallet แล้วเติมเงิน', en: 'Add it to Wallet and top it up' },
      },
    ],
  },
  {
    title: { th: 'มือถือและไฟฟ้า', en: 'Phone and power' },
    items: [
      { id: 'esim', label: { th: 'eSIM หรือ Pocket WiFi', en: 'eSIM or pocket Wi-Fi' } },
      {
        id: 'plug',
        label: { th: 'หัวปลั๊กแปลง', en: 'Plug adapter' },
        note: {
          th: 'ญี่ปุ่นใช้ปลั๊กแบนสองขา ไฟ 100V ปลั๊กสามขาเสียบไม่ได้',
          en: 'Japan uses two flat pins at 100 V; three-pin plugs will not fit',
        },
      },
      {
        id: 'powerbank',
        label: { th: 'พาวเวอร์แบงก์', en: 'Power bank' },
        note: { th: 'ต้องถือขึ้นเครื่อง', en: 'Carry-on only' },
      },
      {
        id: 'offline',
        label: { th: 'เปิดแอปนี้ตอนมีเน็ตก่อนบิน', en: 'Open this app online before you fly' },
        note: { th: 'ให้แอปเก็บข้อมูลไว้ใช้ออฟไลน์', en: 'So it is saved for offline use' },
      },
    ],
  },
  {
    title: { th: 'สุขภาพและของใช้', en: 'Health and small items' },
    items: [
      {
        id: 'meds',
        label: { th: 'ยาประจำตัวและยาสามัญ', en: 'Your medicines and basics' },
        note: { th: 'รวมยาแก้เมารถ', en: 'Include motion-sickness tablets' },
      },
      {
        id: 'lipbalm',
        label: { th: 'ลิปบาล์มและโลชั่น', en: 'Lip balm and moisturiser' },
        note: { th: 'อากาศแห้งมาก', en: 'The air is very dry' },
      },
      {
        id: 'kairo',
        label: { th: 'แผ่นแปะร้อน (kairo)', en: 'Heat packs (kairo)' },
        note: { th: 'ซื้อที่ร้านสะดวกซื้อในญี่ปุ่นได้', en: 'Sold in Japanese convenience stores' },
      },
      {
        id: 'handkerchief',
        label: { th: 'ผ้าเช็ดหน้า', en: 'Handkerchief' },
        note: { th: 'ห้องน้ำหลายที่ไม่มีกระดาษเช็ดมือ', en: 'Many toilets have no paper towels' },
      },
      {
        id: 'trashbag',
        label: { th: 'ถุงใส่ขยะเล็ก', en: 'Small rubbish bag' },
        note: { th: 'ถังขยะสาธารณะหายาก', en: 'Public bins are rare' },
      },
      { id: 'coinpurse', label: { th: 'กระเป๋าใส่เหรียญ', en: 'Coin purse' } },
      { id: 'foldbag', label: { th: 'กระเป๋าพับสำหรับของฝาก', en: 'Foldable souvenir bag' } },
    ],
  },
]

export interface KitItem {
  name: string
  layer: Text
  price: number
  /** Price before a sale, when there is one. */
  oldPrice?: number
  url: string
  why: Text
}

/** The date the Decathlon prices were read. */
export const KIT_PRICES_CHECKED = '2026-10-05'

/** A men's cold-weather kit from decathlon.co.th that covers this Trip. */
export const kit: KitItem[] = [
  {
    name: "Men's Hooded Down Jacket -5°C MH100",
    layer: { th: 'ชั้นนอก', en: 'Outer' },
    price: 1080,
    oldPrice: 1950,
    url: 'https://www.decathlon.co.th/en-TH/p/men-s-hiking-hooded-down-jacket-5-c-mh100-blue-simond-8858286.html',
    why: { th: 'อุ่นถึง -5 °C พับเก็บได้เล็ก', en: 'Warm to -5 °C and packs small' },
  },
  {
    name: "Men's Raincut 1/2 Zip Jacket",
    layer: { th: 'ชั้นนอก', en: 'Outer' },
    price: 350,
    url: 'https://www.decathlon.co.th/en-TH/p/men-s-windproof-and-waterproof-hiking-jacket-raincut-1-2-zip-black-quechua-8862313.html',
    why: { th: 'กันลมกันฝน ใส่ทับฟลีซ', en: 'Wind and rain shell over the fleece' },
  },
  {
    name: "Men's Hiking Fleece MH100 Full Zip",
    layer: { th: 'ชั้นกลาง', en: 'Mid' },
    price: 500,
    url: 'https://www.decathlon.co.th/en-TH/p/men-s-mountain-hiking-fleece-mh100-full-zip-blue-quechua-8647631.html',
    why: { th: 'ใส่ได้ทุกวัน', en: 'For every day' },
  },
  {
    name: "Men's Thermal Base Layer Bottoms BL 100",
    layer: { th: 'ชั้นใน', en: 'Base' },
    price: 220,
    url: 'https://www.decathlon.co.th/en-TH/p/men-s-skiing-thermal-base-layer-bottoms-bl-100-black-wedze-8510030.html',
    why: { th: 'ใส่ใต้กางเกง Day 1–3', en: 'Under trousers on Day 1–3' },
  },
  {
    name: "Men's Hiking Trousers NH500 Regular",
    layer: { th: 'กางเกง', en: 'Trousers' },
    price: 700,
    url: 'https://www.decathlon.co.th/en-TH/p/men-s-hiking-trousers-nh500-regular-grey-quechua-968697.html',
    why: { th: 'ยืด แห้งเร็ว ใส่ในเมืองได้', en: 'Stretchy, quick-drying, fine in town' },
  },
  {
    name: 'Trekking Fleece Gloves MT500',
    layer: { th: 'ของเล็ก', en: 'Small things' },
    price: 350,
    url: 'https://www.decathlon.co.th/en-TH/p/adult-mountain-trekking-fleece-gloves-mt500-black-quechua-8738791.html',
    why: { th: 'ใช้จอมือถือได้', en: 'Touchscreen-friendly' },
  },
  {
    name: 'Adult Warm Beanie',
    layer: { th: 'ของเล็ก', en: 'Small things' },
    price: 300,
    oldPrice: 340,
    url: 'https://www.decathlon.co.th/en-TH/p/adult-beanie-purple-modern-style-warm-hat-quechua-8991474.html',
    why: { th: 'ช่วยมากตอนลมเย็นที่ทะเลสาบ', en: 'Helps a lot in the lake wind' },
  },
  {
    name: 'Warm High Hiking Socks SH100 (2 pairs)',
    layer: { th: 'ของเล็ก', en: 'Small things' },
    price: 400,
    oldPrice: 420,
    url: 'https://www.decathlon.co.th/en-TH/p/adults-warm-high-hiking-socks-2-pairs-sh100-black-quechua-8738841.html',
    why: { th: 'ผสมขนสัตว์ อุ่นเท้า', en: 'Wool blend, warm feet' },
  },
]

export function kitTotal(items: KitItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

const STORAGE_KEY = 'gogo-packing-done'

/** Ticked checklist ids, remembered per device. */
export function readChecked(): Set<string> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return new Set(Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [])
  } catch {
    return new Set()
  }
}

export function saveChecked(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // Private mode or blocked storage: ticks simply last for this visit.
  }
}
