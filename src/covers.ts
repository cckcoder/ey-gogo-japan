import coversData from './data/covers.json'
import type { Day } from './snapshot'

export interface CoverCredit {
  file: string
  title: string
  artist: string
  license: string
  source: string
}

// Every webp in assets/covers, keyed by file name without extension. Vite hashes
// and emits each one, so Workbox precaches them; adding a cover needs no code change.
const files = import.meta.glob<string>('./assets/covers/*.webp', { eager: true, import: 'default' })
const images: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace(/^.*\/(.+)\.webp$/, '$1'), url]),
)

/** The welcome collage's tall hero photo. */
export const heroSrc: string = images[coversData.hero] ?? images[coversData.fallback]!

/** Used whenever a Day or card has no cover of its own. */
export const fallbackSrc: string = images[coversData.fallback]!

/** The image for a cover key, or the fallback when the key is unknown. */
export function imageForKey(key: string): string {
  return images[key] ?? fallbackSrc
}

/** The cover for a Published Card id, or the fallback when it has none. */
export function coverForCard(cardId: string): string {
  const key = (coversData.cards as Record<string, string>)[cardId]
  return key ? imageForKey(key) : fallbackSrc
}

/** A Day's cover: its first card's cover, else the fallback. */
export function dayCover(day: Day): string {
  const first = day.cards[0]
  return first ? coverForCard(first.id) : fallbackSrc
}

/** All photo credits from covers.json, in file order, kept for the footer. */
export const credits: CoverCredit[] = Object.values(coversData.credits)
