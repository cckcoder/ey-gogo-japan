import translationsEn from './data/translations.en.json'
import { tidyTitle, type Locale } from './format'
import type { PublishedCard } from './snapshot'

interface Translation {
  source: string // fingerprint of the Thai markdown this was translated from
  title: string
  markdown: string
}

const english: Record<string, Translation> = translationsEn

/** FNV-1a (32-bit) over UTF-8, as hex. Claude Code writes the same value when it translates. */
export function fingerprint(text: string): string {
  let hash = 0x811c9dc5
  for (const byte of new TextEncoder().encode(text)) {
    hash ^= byte
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

export interface CardContent {
  title: string
  markdown: string
}

/**
 * A card in the chosen language. English comes from Claude Code's translation
 * and is used only while it still matches the card's current Thai text; a card
 * edited in Trello since then shows as written until it is translated again.
 */
export function cardContent(card: PublishedCard, locale: Locale): CardContent {
  if (locale === 'en') {
    const translation = english[card.id]
    if (translation && translation.source === fingerprint(card.markdown)) {
      return { title: tidyTitle(translation.title), markdown: translation.markdown }
    }
  }
  return { title: card.title, markdown: card.markdown }
}
