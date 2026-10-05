import { describe, expect, it } from 'vitest'
import { setLocale, t, type Locale } from './i18n'

describe('packing title split', () => {
  it.each<Locale>(['th', 'en'])('lead + accent equals the full title in %s', (lang) => {
    setLocale(lang)
    expect(t('packingTitleLead') + t('packingTitleAccent')).toBe(t('packingTitle'))
  })
})
