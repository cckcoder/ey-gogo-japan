import snapshotData from './data/snapshot.json'
import { tidyTitle } from './format'

export interface Snapshot {
  generatedAt: string // ISO 8601 UTC
  days: Day[] // Day 0..8, already in order
}

export interface Day {
  index: number // 0-based
  date: string // "2026-11-24"
  destination: string | null
  cards: PublishedCard[] // already in Trello order
}

export interface PublishedCard {
  id: string
  title: string
  markdown: string // Trello card description, as written
}

// The JSON stays exactly as Claude Code wrote it; titles are tidied for display here.
export const snapshot: Snapshot = {
  ...snapshotData,
  days: snapshotData.days.map((day) => ({
    ...day,
    cards: day.cards.map((card) => ({ ...card, title: tidyTitle(card.title) })),
  })),
}
