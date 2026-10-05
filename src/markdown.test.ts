import { describe, expect, it } from 'vitest'
import { renderCard } from './markdown'
import { snapshot } from './snapshot'

const day4 = snapshot.days.find((day) => day.index === 4)
if (!day4) {
  throw new Error('Day 4 is missing from the Snapshot')
}
const card = day4.cards[0]
if (!card) {
  throw new Error('Day 4 has no Published Card')
}

describe('renderCard', () => {
  const html = renderCard(card.markdown)

  it('renders the Day 4 map URL as a link that opens in a new tab', () => {
    expect(html).toContain(
      '<a href="https://maps.app.goo.gl/KJumsxANsbUqFmQg7" target="_blank" rel="noopener"',
    )
  })

  it('renders bold markdown as <strong>', () => {
    expect(html).toContain('<strong>Lunch</strong>')
  })

  it('turns single newlines into <br>', () => {
    const adjacent = 'จากสถานี Asakusabashi Station\nลงที่สถานี'
    expect(card.markdown).toContain(adjacent)
    expect(html).toContain(adjacent.replace('\n', '<br>'))
    expect(renderCard('a\nb')).toContain('a<br>b')
  })
})

describe('renderCard reading aids', () => {
  it('collapses a Google Maps self-URL to the map label', () => {
    const html = renderCard('https://maps.app.goo.gl/KJumsxANsbUqFmQg7')
    expect(html).toContain('href="https://maps.app.goo.gl/KJumsxANsbUqFmQg7"')
    expect(html).toContain('แผนที่ ↗')
    expect(html).toContain('class="url-link"')
  })

  it('wraps a line-start time in <time class="slot">', () => {
    expect(renderCard('10:30  ไป Gotokuji')).toContain(
      '<time class="slot">10:30</time>',
    )
  })

  it('leaves a time that is not at the start of a line as plain text', () => {
    const html = renderCard('Open 17.30-21.00')
    expect(html).not.toContain('<time')
    expect(html).toContain('17.30-21.00')
  })

  it('keeps the author-written text of a markdown link', () => {
    const html = renderCard('[Shogun Burger](https://maps.app.goo.gl/ttkGLF7bUZazaTjQA)')
    expect(html).toContain('Shogun Burger')
    expect(html).toContain('href="https://maps.app.goo.gl/ttkGLF7bUZazaTjQA"')
    expect(html).not.toContain('class="url-link"')
  })

  it('does not wrap a line-start time that is inside emphasis', () => {
    const html = renderCard('**8:45 Go Gotokuji**')
    expect(html).not.toContain('<time')
    expect(html).toContain('<strong>8:45 Go Gotokuji</strong>')
  })

  it('normalises a dotted line-start time to HH:MM and keeps the digits', () => {
    expect(renderCard('17.30 กลับโรงแรม')).toContain('<time class="slot">17:30</time>')
  })

  it('collapses other self-URLs to hostname + arrow', () => {
    const html = renderCard('https://example.com/some/path')
    expect(html).toContain('example.com ↗')
    expect(html).not.toContain('>https://example.com')
    expect(html).toContain('class="url-link"')
  })

  it('collapses the extra blank lines Trello leaves behind', () => {
    const html = renderCard('a\n\n\n\n\nb')
    expect(html).toBe(renderCard('a\n\nb'))
    expect(html).not.toContain('<p></p>')
  })

  it('escapes quotes in link attributes and drops the Trello smartCard title', () => {
    expect(renderCard('[x](https://example.com (a "b"))')).toContain('title="a &quot;b&quot;"')
    expect(renderCard('[x](https://example.com "smartCard-inline")')).not.toContain('title=')
  })

  it('renders the Day 4 card with no raw https:// left in its visible text', () => {
    const html = renderCard(card.markdown)
    expect(html).toContain('แผนที่ ↗')
    const visible = html.replace(/<[^>]+>/g, '')
    expect(visible).not.toContain('https://')
  })
})

describe('renderCard map label', () => {
  it('uses the given label for collapsed map links', () => {
    expect(renderCard('https://maps.app.goo.gl/abc', 'Map')).toContain('>Map ↗</a>')
  })
})
