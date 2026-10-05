import { Marked } from 'marked'
import type { Tokens } from 'marked'

const MAP_LABEL = 'แผนที่ ↗'
const ARROW = ' ↗'
const TIME_AT_LINE_START = /^([ \t]*)(\d{1,2})[:.](\d{2})(?!\d)/gm

/** True when the author did not write link text, so marked used the URL itself. */
function isSelfUrl(token: Tokens.Link): boolean {
  return token.text === token.href
}

function hostnameOf(href: string): string {
  try {
    return new URL(href).hostname
  } catch {
    return href
  }
}

function isGoogleMaps(href: string): boolean {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return false
  }
  const host = url.hostname
  if (host === 'maps.app.goo.gl') return true
  if (host === 'goo.gl' && url.pathname.startsWith('/maps')) return true
  if ((host === 'google.com' || host === 'www.google.com') && url.pathname.startsWith('/maps')) {
    return true
  }
  return false
}

/** A time at the start of a line becomes a `<time class="slot">`; later times stay text. */
function wrapLineStartTimes(markdown: string): string {
  return markdown.replace(
    TIME_AT_LINE_START,
    (_match, indent: string, hours: string, minutes: string) =>
      `${indent}<time class="slot">${hours}:${minutes}</time>`,
  )
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

const md = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    link(token) {
      const selfUrl = isSelfUrl(token)
      const text = selfUrl
        ? isGoogleMaps(token.href)
          ? MAP_LABEL
          : `${hostnameOf(token.href)}${ARROW}`
        : this.parser.parseInline(token.tokens)
      const className = selfUrl ? ' class="url-link"' : ''
      // Trello stores its link-preview flag ("smartCard-inline") as the title; it is not a tooltip.
      const title =
        token.title && token.title !== 'smartCard-inline'
          ? ` title="${escapeAttribute(token.title)}"`
          : ''
      const href = escapeAttribute(token.href)
      return `<a href="${href}" target="_blank" rel="noopener"${className}${title}>${text}</a>`
    },
  },
})

/** Render a card. `mapLabel` replaces the Thai `แผนที่` on collapsed map links (e.g. `Map`). */
export function renderCard(markdown: string, mapLabel?: string): string {
  const normalised = markdown.replace(/\n{3,}/g, '\n\n')
  const html = md.parse(wrapLineStartTimes(normalised), { async: false })
  return mapLabel ? html.replaceAll(`>${MAP_LABEL}</a>`, `>${mapLabel}${ARROW}</a>`) : html
}
