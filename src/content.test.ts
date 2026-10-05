import { describe, expect, it } from 'vitest'
import { cardContent, fingerprint } from './content'
import { snapshot } from './snapshot'

const kamakura = snapshot.days[5]!.cards[0]!

describe('cardContent', () => {
  it('keeps the Thai card as written', () => {
    expect(cardContent(kamakura, 'th').markdown).toBe(kamakura.markdown)
  })

  it('uses the English translation while it matches the Thai text', () => {
    const english = cardContent(kamakura, 'en')
    expect(english.title).toBe('Kamakura, Enoshima')
    expect(english.markdown).toContain('Walk 25 minutes (1.6 km) to Enoshima Island')
    expect(english.markdown).not.toMatch(/[฀-๿]/)
  })

  it('falls back to Thai once the card has changed in Trello', () => {
    const edited = { ...kamakura, markdown: `${kamakura.markdown}\nเพิ่มร้านใหม่` }
    expect(cardContent(edited, 'en').markdown).toBe(edited.markdown)
  })

  it('has an English translation for every Published Card', () => {
    for (const day of snapshot.days) {
      for (const card of day.cards) {
        const english = cardContent(card, 'en')
        expect(english.title === card.title && english.markdown === card.markdown, card.title).toBe(false)
      }
    }
  })
})

describe('fingerprint', () => {
  it('is FNV-1a over UTF-8, matching what Claude Code writes', () => {
    expect(fingerprint('')).toBe('811c9dc5')
    expect(fingerprint('ไทย')).toBe('1426044f') // same value Python computes
  })
})

describe('covers', () => {
  it('gives every Published Card its own cover, not the fallback', async () => {
    const { coverForCard, fallbackSrc } = await import('./covers')
    for (const day of snapshot.days) {
      for (const card of day.cards) {
        expect(coverForCard(card.id), card.title).not.toBe(fallbackSrc)
      }
    }
  })
})
